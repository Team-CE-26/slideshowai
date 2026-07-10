import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GENERATOR_NICHES } from "@/lib/generator-options";

// "Help me find my hook": the user describes their business / goal in plain
// words; gpt-4o-mini returns 3 ready-to-run hook options, each with a short
// plain-English explanation of WHY the hook works (educational, builds trust)
// plus Generator-ready settings (niche, slide count, prompt). Same pattern as
// /api/trends/remix — structured outputs, cheap, profile-aware.
export const runtime = "nodejs";

const NICHE_VALUES = GENERATOR_NICHES.map((n) => n.value);

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hooks"],
  properties: {
    hooks: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["hook", "why", "niche", "slide_count", "prompt"],
        properties: {
          hook: { type: "string" },
          why: { type: "string" },
          niche: { type: "string", enum: NICHE_VALUES },
          slide_count: { type: "integer" },
          prompt: { type: "string" },
        },
      },
    },
  },
} as const;

const SYSTEM = `You are a TikTok growth coach for small-business owners. The user describes their business and what they want to achieve, in plain words. Return exactly 3 DIFFERENT hook options for a TikTok Photo Mode slideshow.

For each hook:
- "hook": the actual opening line of the slideshow (the title slide text). Punchy, scroll-stopping, under 12 words. Use proven mechanics — numbered lists ("5 mistakes..."), negativity bias ("why you're not..."), curiosity gaps, POV framing, transformations. Vary the mechanic across the 3 options.
- "why": ONE short sentence, plain English, explaining to a beginner why this hook works (the psychology: e.g. "Numbered mistakes make people swipe to check if they're guilty."). No jargon.
- "niche": the closest niche value from the allowed enum.
- "slide_count": 5-8, whatever fits the hook's structure.
- "prompt": 1-2 sentences of instructions for the slideshow generator — what the deck should say, specific to THIS business, naturally weaving in what they offer. Written in third person about the business, not addressed to the user.

Ground everything in the user's actual business. Never invent facts (prices, locations, claims) they didn't give you.`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { description } = (await request.json().catch(() => ({}))) as {
    description?: string;
  };
  const text = (description ?? "").trim().slice(0, 600);
  if (text.length < 8) {
    return NextResponse.json(
      { error: "Tell us a bit more about your business first." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("REPLACE_ME")) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  // Onboarding profile enriches the context when present.
  const meta = user.user_metadata ?? {};
  const business = {
    name: (meta.business_name as string) || null,
    niche: (meta.niche as string) || null,
    goal: (meta.goal as string) || null,
  };

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey, timeout: 45_000, maxRetries: 1 });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: JSON.stringify({ user_words: text, profile: business }) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "hooks", strict: true, schema: SCHEMA },
    },
  });

  interface Hook {
    hook: string;
    why: string;
    niche: string;
    slide_count: number;
    prompt: string;
  }
  const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as {
    hooks?: Hook[];
  };
  const hooks = (parsed.hooks ?? [])
    .filter((h) => h.hook?.trim() && h.prompt?.trim())
    .slice(0, 3)
    .map((h) => ({
      hook: h.hook.trim(),
      why: (h.why ?? "").trim(),
      niche: NICHE_VALUES.includes(h.niche) ? h.niche : NICHE_VALUES[0],
      slides: String(Math.min(8, Math.max(5, h.slide_count || 6))),
      prompt: h.prompt.trim(),
    }));

  if (!hooks.length) {
    return NextResponse.json(
      { error: "Couldn't come up with hooks — try rephrasing." },
      { status: 502 },
    );
  }

  return NextResponse.json({ hooks });
}
