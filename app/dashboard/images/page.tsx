import { GYM_IMAGES } from "@/lib/library-images";

export default function ImageLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Image Library</h1>
          <p className="mt-1 text-sm text-muted">
            {`${GYM_IMAGES.length} images · Gym & Fitness collection (test set)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-text"
          >
            New collection
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-colors hover:bg-accent-strong"
          >
            <span aria-hidden>⬆</span> Upload images
          </button>
        </div>
      </div>

      {/* Masonry gallery */}
      <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4">
        {GYM_IMAGES.map((src, i) => (
          <div
            key={src}
            className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Gym test image ${i + 1}`}
              loading="lazy"
              className="w-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
