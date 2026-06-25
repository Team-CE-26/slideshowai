"use client";

import { useState } from "react";
import {
  DEFAULT_NICHE,
  DEMO_SLIDES,
  NICHES,
  type NicheId,
} from "@/lib/demo-data";
import { SlidePreview } from "./SlidePreview";

export function NicheDemo() {
  const [active, setActive] = useState<NicheId>(DEFAULT_NICHE);
  const slides = DEMO_SLIDES[active];

  return (
    <section id="demo" className="scroll-mt-20 bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            See it in action
          </h2>
          <p className="mt-4 text-lg text-muted">
            Pick a niche and watch the slideshow change. Every set is sized for
            TikTok Photo Mode and captioned to stop the scroll.
          </p>
        </div>

        {/* niche selector pills */}
        <div
          role="group"
          aria-label="Choose a niche"
          className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
        >
          {NICHES.map((niche) => {
            const selected = niche.id === active;
            return (
              <button
                key={niche.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(niche.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-accent bg-accent text-accent-foreground shadow-md shadow-accent/25"
                    : "border-border bg-card text-muted hover:border-accent hover:text-accent-text"
                }`}
              >
                <span aria-hidden>{niche.emoji}</span>
                {niche.label}
              </button>
            );
          })}
        </div>

        {/* slide previews — horizontal scroll on mobile, grid on desktop.
            keyed by niche so the fade-up animation replays on every switch. */}
        <div
          key={active}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0"
        >
          {slides.map((slide, i) => (
            <div
              key={slide.image}
              className="w-[62%] shrink-0 snap-center animate-fade-up sm:w-[44%] md:w-auto"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <SlidePreview slide={slide} index={i} total={slides.length} />
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Preview only — real slideshows are generated from your products.
        </p>
      </div>
    </section>
  );
}
