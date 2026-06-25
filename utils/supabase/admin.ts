import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY service-role client (Supabase secret key). It bypasses Row Level
// Security, so it must NEVER be imported into client code. Used only by trusted
// server contexts that legitimately act across users — i.e. the scheduled
// draft-cleanup cron.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret || secret.includes("REPLACE_ME")) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not configured (set it in .env.local).",
    );
  }
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
