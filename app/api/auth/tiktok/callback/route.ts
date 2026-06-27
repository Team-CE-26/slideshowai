import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Handles the TikTok OAuth redirect, exchanges code for tokens, persists to
// tiktok_connections, then redirects back to return_to (or slideshows list).
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const storedState = request.cookies.get("tiktok_oauth_state")?.value;
  const returnTo = request.cookies.get("tiktok_return_to")?.value ?? "/dashboard/slideshows";

  function failRedirect(msg: string): NextResponse {
    const dest = new URL(returnTo, request.url);
    dest.searchParams.set("tiktok_error", msg);
    const res = NextResponse.redirect(dest);
    res.cookies.delete("tiktok_oauth_state");
    res.cookies.delete("tiktok_return_to");
    return res;
  }

  if (errorParam) return failRedirect(errorParam);
  if (!code || !state || state !== storedState) return failRedirect("OAuth state mismatch.");

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!clientKey || !clientSecret || !appUrl) return failRedirect("Server misconfiguration.");

  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${appUrl}/api/auth/tiktok/callback`,
    }),
  });

  const tokenData = await tokenRes.json() as {
    data?: {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      open_id?: string;
    };
    error?: { code?: string; message?: string };
  };

  if (!tokenRes.ok || (tokenData.error?.code && tokenData.error.code !== "ok")) {
    return failRedirect(tokenData.error?.message ?? "Token exchange failed.");
  }

  const { access_token, refresh_token, expires_in = 86400, open_id } = tokenData.data ?? {};
  if (!access_token || !refresh_token || !open_id) {
    return failRedirect("Incomplete token response from TikTok.");
  }

  const { error: upsertErr } = await supabase.from("tiktok_connections").upsert(
    {
      user_id: user.id,
      open_id,
      access_token,
      refresh_token,
      expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (upsertErr) return failRedirect("Failed to save TikTok connection.");

  const successDest = new URL(returnTo, request.url);
  successDest.searchParams.set("tiktok_connected", "1");
  const res = NextResponse.redirect(successDest);
  res.cookies.delete("tiktok_oauth_state");
  res.cookies.delete("tiktok_return_to");
  return res;
}
