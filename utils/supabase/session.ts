import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the user's auth session on each request and keeps the auth cookies
// in sync between the browser and the server.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not run code between createServerClient and this call.
  //
  // This proxy refreshes session cookies. It makes NO authorization decisions —
  // every page and route handler independently calls auth.getUser(), which
  // validates the JWT against the Auth server, and that is what actually guards
  // access.
  //
  // So we deliberately use getSession() rather than getUser() here. getUser() is
  // an unconditional network round-trip to /auth/v1/user, and because this proxy
  // matches nearly every path it was charging ~110ms to EVERY request in the app
  // — static marketing pages and API calls included (measured). getSession()
  // reads the token from the cookies and only hits the network when it has
  // actually expired and needs refreshing, which is precisely this function's
  // job. Security posture is unchanged: nothing here is trusted for authz.
  await supabase.auth.getSession();

  return supabaseResponse;
}
