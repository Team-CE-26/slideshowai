import { NextResponse } from "next/server";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { createClient } from "@/utils/supabase/server";
import { generateListicle, type ListicleSlide } from "@/lib/generate/listicle";
import { compositeSlide } from "@/lib/generate/composite";
import { GYM_IMAGES } from "@/lib/library-images";

// Sharp needs the Node.js runtime (not edge). Next auto-externalizes `sharp`.
export const runtime = "nodejs";
export const maxDuration = 60;

const SIGNED_URL_TTL = 60 * 60; // 1 hour

type BackgroundMode = "collection" | "auto" | "single";

interface GenerateBody {
  niche?: string;
  slideCount?: number;
  slideshowCount?: number;
  prompt?: string; // the "angle / product" box — used as the plug
  layout?: string;
  backgroundMode?: BackgroundMode;
  collection?: string;
  style?: string;
  model?: string;
  singleImage?: string; // optional data URL for "single" mode
}

function collectionImagePaths(): string[] {
  return GYM_IMAGES.map((p) =>
    path.join(process.cwd(), "public", p.replace(/^\//, "")),
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  // Optional: when signed in, results are persisted as drafts; otherwise the
  // preview is ephemeral (returned as data URLs, not saved).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const slideCount = Math.min(Math.max(Number(body.slideCount) || 6, 3), 10);
  const slideshowCount = Math.min(
    Math.max(Number(body.slideshowCount) || 1, 1),
    5,
  );
  const mode: BackgroundMode = body.backgroundMode ?? "collection";

  // --- Optional, clearly-separated branch: AI image generation (disabled). ---
  if (mode === "auto") {
    return NextResponse.json(
      {
        error:
          "Auto-generate (AI images) isn't enabled yet. Pick an image collection for now.",
      },
      { status: 501 },
    );
  }

  // 1) Listicle copy (OpenAI, structured output, validated)
  let content: ListicleSlide[][];
  try {
    content = await generateListicle({
      niche: body.niche || "small business",
      description: body.prompt || "",
      slideCount,
      slideshowCount,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed.";
    const status = message.includes("OPENAI_API_KEY")
      ? 400
      : message.includes("quota")
        ? 429
        : 502;
    return NextResponse.json({ error: message }, { status });
  }

  // 2) Backgrounds
  let backgrounds: Buffer[];
  try {
    if (mode === "single" && body.singleImage?.startsWith("data:")) {
      backgrounds = [Buffer.from(body.singleImage.split(",")[1] ?? "", "base64")];
    } else {
      backgrounds = await Promise.all(
        collectionImagePaths().map((f) => readFile(f)),
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Could not load background images." },
      { status: 500 },
    );
  }
  if (backgrounds.length === 0) {
    return NextResponse.json(
      { error: "No background images available." },
      { status: 500 },
    );
  }

  // 3) Composite each slide; persist as a draft only when signed in.
  try {
    const slideshows = await Promise.all(
      content.map(async (slides, ssIdx) => {
        const title =
          slides.find((s) => s.role === "title")?.text ||
          body.niche ||
          "Untitled slideshow";

        const pngs = await Promise.all(
          slides.map((slide, i) =>
            compositeSlide(
              backgrounds[(ssIdx * slideCount + i) % backgrounds.length],
              { text: slide.text, role: slide.role, number: slide.number },
            ),
          ),
        );

        // --- Not signed in: ephemeral preview (data URLs, not saved) ---
        if (!user) {
          return {
            id: null,
            title,
            persisted: false,
            slides: slides.map((slide, i) => ({
              caption: slide.text,
              role: slide.role,
              number: slide.number,
              url: `data:image/png;base64,${pngs[i].toString("base64")}`,
            })),
          };
        }

        // --- Signed in: persist as a draft (Storage + DB), return signed URLs ---
        const { data: ss, error: ssErr } = await supabase
          .from("slideshows")
          .insert({
            user_id: user.id,
            title,
            niche: body.niche ?? null,
            description: body.prompt ?? null,
            layout: body.layout ?? "listicle",
            slide_count: slides.length,
            status: "draft",
          })
          .select("id")
          .single();
        if (ssErr || !ss) {
          throw new Error(ssErr?.message || "Could not create slideshow.");
        }

        const paths = pngs.map((_, i) => `${user.id}/${ss.id}/${i}.png`);
        const uploads = await Promise.all(
          pngs.map((png, i) =>
            supabase.storage
              .from("slideshows")
              .upload(paths[i], png, { contentType: "image/png", upsert: true }),
          ),
        );
        const uploadErr = uploads.find((u) => u.error)?.error;
        if (uploadErr) throw new Error(uploadErr.message);

        const { error: slErr } = await supabase.from("slides").insert(
          slides.map((slide, i) => ({
            slideshow_id: ss.id,
            position: i,
            role: slide.role,
            number: slide.number,
            caption: slide.text,
            storage_path: paths[i],
          })),
        );
        if (slErr) throw new Error(slErr.message);

        const { data: signed } = await supabase.storage
          .from("slideshows")
          .createSignedUrls(paths, SIGNED_URL_TTL);

        return {
          id: ss.id as string,
          title,
          persisted: true,
          slides: slides.map((slide, i) => ({
            caption: slide.text,
            role: slide.role,
            number: slide.number,
            url: signed?.[i]?.signedUrl ?? "",
          })),
        };
      }),
    );

    return NextResponse.json({ slideshows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to build slideshow.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
