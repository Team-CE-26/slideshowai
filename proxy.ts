import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/session";

// Next.js 16 renamed the "middleware" file convention to "proxy".
// Runs at the edge before requests; here it refreshes the Supabase session.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all paths except static assets and image files:
     * - _next/static, _next/image
     * - favicon.ico
     * - image files (svg/png/jpg/jpeg/gif/webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
