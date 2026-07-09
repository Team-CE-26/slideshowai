import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

// Cancel a queued scheduled post. Only queued rows can be removed — anything
// the publisher already picked up stays for the record.
export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("scheduled_posts")
    .delete()
    .eq("id", id)
    .eq("status", "queued")
    .select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json(
      { error: "Not found, or already publishing." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
