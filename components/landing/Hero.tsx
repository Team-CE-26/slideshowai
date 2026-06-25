import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft accent glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[480px] max-w-4xl rounded-full bg-accent-text/20 blur-3xl"
      />
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-20 text-center sm:px-8 sm:pb-24 sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-text" />
          AI-powered · TikTok Photo Mode
        </span>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Ready-to-post TikTok slideshows that{" "}
          <span className="text-accent-text">sell your products</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          SlideShowAI turns your business into scroll-stopping TikTok Photo Mode
          slideshows. Pick your niche, let AI write the captions, and download
          post-ready 9:16 slides in seconds.
        </p>

        <div className="mt-9 flex justify-center">
          <Button href="/dashboard" size="lg">
            Get Started
            <span aria-hidden>→</span>
          </Button>
        </div>

        <p className="mt-5 text-sm text-muted">
          No design skills. No editing. Just generate and post.
        </p>
      </div>
    </section>
  );
}
