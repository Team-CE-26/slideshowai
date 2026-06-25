import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

// User-specific + short-lived signed URLs → always render fresh.
export const dynamic = "force-dynamic";

interface SlideRow {
  position: number;
  storage_path: string | null;
}
interface ShowRow {
  id: string;
  title: string | null;
  niche: string | null;
  slide_count: number | null;
  created_at: string;
  slides: SlideRow[];
}

export default async function SlideshowsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your slideshows
        </h1>
        <div className="mt-10 flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border bg-surface px-6 py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-2xl" aria-hidden>
            🔒
          </span>
          <p className="mt-5 text-lg font-semibold">
            Sign in to save and view slideshows
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Generated slideshows are saved to your account. Sign in to keep them
            and find them here. You can still generate and download without an
            account.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-colors hover:bg-accent-strong"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("slideshows")
    .select("id, title, niche, slide_count, created_at, slides(position, storage_path)")
    .eq("status", "saved")
    .order("created_at", { ascending: false });
  const shows = (data ?? []) as ShowRow[];

  const items = await Promise.all(
    shows.map(async (s) => {
      const first = [...(s.slides ?? [])].sort(
        (a, b) => a.position - b.position,
      )[0];
      let thumb = "";
      if (first?.storage_path) {
        const { data: sig } = await supabase.storage
          .from("slideshows")
          .createSignedUrl(first.storage_path, 3600);
        thumb = sig?.signedUrl ?? "";
      }
      return {
        id: s.id,
        title: s.title ?? "Untitled slideshow",
        niche: s.niche,
        slideCount: s.slide_count ?? s.slides?.length ?? 0,
        createdAt: s.created_at,
        thumb,
      };
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your slideshows
          </h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} saved {items.length === 1 ? "slideshow" : "slideshows"}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-colors hover:bg-accent-strong"
        >
          <span aria-hidden>+</span> New slideshow
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border bg-surface px-6 py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-2xl" aria-hidden>
            🎞️
          </span>
          <p className="mt-5 text-lg font-semibold">No saved slideshows yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Generate a slideshow and hit “Save to my slideshows” to keep it here.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-colors hover:bg-accent-strong"
          >
            Create your first slideshow
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/slideshows/${s.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50"
            >
              <div className="aspect-[9/16] w-full overflow-hidden bg-surface">
                {s.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.thumb}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{s.title}</p>
                <p className="mt-1 truncate text-xs text-muted">
                  {[s.niche, `${s.slideCount} slides`].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
