import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Deletes draft slideshows (rows + Storage objects) older than ~24h.
// Trigger on a schedule. Protected by CRON_SECRET. Uses the service-role client
// because it must act across all users (bypasses RLS).
export const runtime = "nodejs";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("secret") ||
    "";
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Service key not configured." },
      { status: 500 },
    );
  }

  const cutoff = new Date(Date.now() - MAX_AGE_MS).toISOString();
  const { data: drafts, error } = await admin
    .from("slideshows")
    .select("id, user_id")
    .eq("status", "draft")
    .lt("created_at", cutoff);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let removed = 0;
  for (const d of drafts ?? []) {
    const prefix = `${d.user_id}/${d.id}`;
    const { data: files } = await admin.storage
      .from("slideshows")
      .list(prefix);
    if (files && files.length > 0) {
      await admin.storage
        .from("slideshows")
        .remove(files.map((f) => `${prefix}/${f.name}`));
    }
    await admin.from("slideshows").delete().eq("id", d.id);
    removed++;
  }

  return NextResponse.json({ removed });
}

export async function POST(request: Request) {
  return handle(request);
}
export async function GET(request: Request) {
  return handle(request);
}
