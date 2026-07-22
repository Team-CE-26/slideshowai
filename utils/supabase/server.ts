import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

// Supabase client for use in Server Components, Route Handlers, and Server
// Actions. Reads/writes auth cookies via Next's cookie store.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore when middleware
            // is refreshing sessions (which it is, see middleware.ts).
          }
        },
      },
    },
  );
}

// Per-request memoized current user.
//
// `auth.getUser()` is a NETWORK round-trip to the Supabase Auth server — it
// validates the JWT server-side rather than decoding it locally — and measured
// ~110ms from this app. Every dashboard route renders the layout AND a page,
// and both need the user, so each navigation paid that cost twice for an
// identical answer (three times counting proxy.ts, which runs in a separate
// context we can't share with).
//
// React's cache() dedupes by call within a single request's render pass, so
// layout + page now resolve one shared promise. Use this in Server Components;
// Route Handlers only call getUser once, so they gain nothing from it.
export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
