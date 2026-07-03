import { redirect } from "next/navigation";

// Posts are now merged into the Slideshows hub (split into Posted / Not-posted).
// Keep this route as a redirect so old links/bookmarks land on the hub.
export default function PostsPage() {
  redirect("/dashboard/slideshows");
}
