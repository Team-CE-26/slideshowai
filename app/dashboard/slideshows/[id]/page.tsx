import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SlideshowDetail } from "@/components/dashboard/slideshows/SlideshowDetail";

export const dynamic = "force-dynamic";

interface SlideRow {
  position: number;
  role: string | null;
  number: number | null;
  caption: string | null;
  storage_path: string | null;
}

export default async function SlideshowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/slideshows");

  const { data: ss } = await supabase
    .from("slideshows")
    .select("id, title, niche, status, created_at")
    .eq("id", id)
    .single();
  if (!ss) notFound();

  const { data: slideRows } = await supabase
    .from("slides")
    .select("position, role, number, caption, storage_path")
    .eq("slideshow_id", id)
    .order("position", { ascending: true });
  const rows = (slideRows ?? []) as SlideRow[];

  const paths = rows
    .map((r) => r.storage_path)
    .filter((p): p is string => Boolean(p));
  const { data: signed } = await supabase.storage
    .from("slideshows")
    .createSignedUrls(paths, 3600);
  const urlByPath = new Map(
    (signed ?? []).map((x) => [x.path, x.signedUrl]),
  );

  const slides = rows.map((r) => ({
    position: r.position,
    role: r.role,
    number: r.number,
    caption: r.caption,
    url: r.storage_path ? (urlByPath.get(r.storage_path) ?? "") : "",
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link
        href="/dashboard/slideshows"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Back to slideshows
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
        {[ss.status, ss.niche].filter(Boolean).join(" · ")}
      </p>
      <SlideshowDetail
        id={ss.id}
        title={ss.title ?? "Untitled slideshow"}
        slides={slides}
        zipHref={`/api/slideshows/${ss.id}/zip`}
      />
    </div>
  );
}
