import { Generator } from "@/components/dashboard/Generator";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Create slideshows that sell, all in one place
        </h1>
        <p className="mt-3 text-pretty text-muted">
          Stop juggling design tools and caption apps. Describe your product,
          pick a vibe, and generate post-ready 9:16 TikTok slides — captions and
          design done for you.
        </p>
      </div>

      <div className="mt-10">
        <Generator />
      </div>
    </div>
  );
}
