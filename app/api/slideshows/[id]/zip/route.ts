import JSZip from "jszip";
import { createClient } from "@/utils/supabase/server";

// Streams a slideshow's slides from Storage into a single .zip. Node runtime.
// Ownership is enforced by RLS (queries + downloads run as the signed-in user).
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: ss } = await supabase
    .from("slideshows")
    .select("title")
    .eq("id", id)
    .single();
  if (!ss) return new Response("Not found", { status: 404 });

  const { data: slides } = await supabase
    .from("slides")
    .select("position, storage_path")
    .eq("slideshow_id", id)
    .order("position", { ascending: true });
  if (!slides || slides.length === 0) {
    return new Response("No slides", { status: 404 });
  }

  const zip = new JSZip();
  for (const s of slides) {
    if (!s.storage_path) continue;
    const { data, error } = await supabase.storage
      .from("slideshows")
      .download(s.storage_path);
    if (error || !data) continue;
    const buf = Buffer.from(await data.arrayBuffer());
    zip.file(`slide-${String(s.position + 1).padStart(2, "0")}.png`, buf);
  }

  const out = await zip.generateAsync({ type: "nodebuffer" });
  const safe =
    (ss.title || "slideshow")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "slideshow";

  return new Response(new Uint8Array(out), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safe}.zip"`,
    },
  });
}
