import { redirect } from "next/navigation";

// Inspiration merged into Trends as the "All-time" tab (2026-07-19); keep the
// old URL working for bookmarks and stale links.
export default function InspirationPage() {
  redirect("/dashboard/trends");
}
