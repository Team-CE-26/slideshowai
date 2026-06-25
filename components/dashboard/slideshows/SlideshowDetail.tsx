"use client";

import {
  deleteSlideshow,
  renameSlideshow,
} from "@/app/dashboard/slideshows/actions";

interface DetailSlide {
  position: number;
  role: string | null;
  number: number | null;
  caption: string | null;
  url: string;
}

export function SlideshowDetail({
  id,
  title,
  slides,
  zipHref,
}: {
  id: string;
  title: string;
  slides: DetailSlide[];
  zipHref: string;
}) {
  async function downloadOne(url: string, name: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <div className="mt-4">
      {/* Header: rename + actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form action={renameSlideshow} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input
            name="title"
            defaultValue={title}
            aria-label="Slideshow title"
            className="w-64 max-w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-bold tracking-tight focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button
            type="submit"
            className="rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-text"
          >
            Rename
          </button>
        </form>

        <div className="flex items-center gap-2">
          <a
            href={zipHref}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-colors hover:bg-accent-strong"
          >
            Download all (.zip)
          </a>
          <form
            action={deleteSlideshow}
            onSubmit={(e) => {
              if (!confirm("Delete this slideshow? This can't be undone.")) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Slides carousel */}
      <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto pb-2">
        {slides.map((s) => (
          <div key={s.position} className="w-[58%] shrink-0 sm:w-[42%] md:w-[260px]">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.url}
                alt={s.caption ?? `Slide ${s.position + 1}`}
                className="aspect-[9/16] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-2.5">
                <span
                  className="truncate text-xs text-muted"
                  title={s.caption ?? ""}
                >
                  {s.position + 1}. {s.caption}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    downloadOne(
                      s.url,
                      `slide-${String(s.position + 1).padStart(2, "0")}.png`,
                    )
                  }
                  className="shrink-0 rounded-md border border-border px-2 py-1 text-[11px] font-semibold transition-colors hover:border-accent hover:text-accent-text"
                >
                  PNG
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
