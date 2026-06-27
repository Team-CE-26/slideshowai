import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createAdminClient } from "@/utils/supabase/admin";
import { verifyProxyToken } from "@/utils/tiktok";

// Public image proxy — no session auth, TikTok's servers pull this directly.
// Authentication is via a short-lived HMAC token in the query string.
// Downloads the slide PNG from Supabase Storage and serves it as JPEG
// (TikTok rejects PNG; JPEG is accepted).
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string; pos: string }> },
) {
  const { id, pos } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const exp = searchParams.get("exp") ?? "";

  if (!verifyProxyToken(id, pos, token, exp)) {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
  }

  const posNum = parseInt(pos, 10);
  if (!Number.isInteger(posNum) || posNum < 0) {
    return NextResponse.json({ error: "Invalid position." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: slide } = await admin
    .from("slides")
    .select("storage_path")
    .eq("slideshow_id", id)
    .eq("position", posNum)
    .single();

  if (!slide?.storage_path) {
    return NextResponse.json({ error: "Slide not found." }, { status: 404 });
  }

  const { data: blob, error } = await admin.storage
    .from("slideshows")
    .download(slide.storage_path);

  if (error || !blob) {
    return NextResponse.json({ error: "Image not found in storage." }, { status: 404 });
  }

  const jpeg = await sharp(Buffer.from(await blob.arrayBuffer()))
    .jpeg({ quality: 85 })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=7200",
      "Content-Length": String(jpeg.byteLength),
    },
  });
}
