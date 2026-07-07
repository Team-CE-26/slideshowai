import { Reveal } from "./Reveal";
import { Eyebrow } from "./Eyebrow";

/* -------------------------------------------------------------------------- */
/*  Shared mockup primitives — a faux "SlideShowAI" app window that mirrors    */
/*  the REAL dashboard (sidebar nav, generator, trends, slideshow view).       */
/* -------------------------------------------------------------------------- */

// Real images from the app's background library (public bucket).
const LIB = (p: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/library/${p}`;

function WindowChrome({
  title,
  subtitle,
  action,
  active,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** Which sidebar item is highlighted. */
  active: string;
  children: React.ReactNode;
}) {
  const nav = [
    { section: "Workspace", items: ["Slideshows", "Image Library"] },
    { section: "Grow", items: ["Trends", "Schedule", "Analytics"] },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl shadow-black/60 ring-1 ring-black/40">
      <div className="flex">
        {/* sidebar — mirrors the real dashboard nav */}
        <aside className="hidden w-32 shrink-0 flex-col justify-between border-r border-white/[0.06] p-3 sm:flex">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-md bg-linear-to-br from-accent to-fuchsia-500" />
              <span className="text-[10px] font-bold text-white">SlideShowAI</span>
            </div>
            <p className="mt-3 rounded-full bg-accent px-2 py-1 text-center text-[8px] font-bold text-white">
              + Create Slideshow
            </p>
            <nav className="mt-3 space-y-2.5">
              {nav.map((group) => (
                <div key={group.section}>
                  <p className="px-1.5 text-[7px] font-bold uppercase tracking-wider text-white/30">
                    {group.section}
                  </p>
                  <div className="mt-1 space-y-0.5 text-[9px] text-white/45">
                    {group.items.map((item) => (
                      <p
                        key={item}
                        className={`rounded px-1.5 py-1 ${
                          item === active
                            ? "bg-accent/15 text-accent-text"
                            : ""
                        }`}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
            <p className="text-[8px] font-semibold text-white/70">Free plan</p>
            <p className="mt-1 rounded-full bg-linear-to-r from-fuchsia-500 to-accent px-1.5 py-0.5 text-center text-[7px] font-semibold text-white">
              Get more credits
            </p>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-[13px] font-bold leading-tight text-white">{title}</h4>
              {subtitle && <p className="mt-0.5 text-[9px] text-white/40">{subtitle}</p>}
            </div>
            {action}
          </div>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PillButton({
  children,
  variant = "ghost",
}: {
  children: React.ReactNode;
  variant?: "ghost" | "accent";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold ${
        variant === "accent"
          ? "bg-accent text-white"
          : "bg-white/10 text-white/80"
      }`}
    >
      {children}
    </span>
  );
}

function Tile({
  img,
  n,
  caption,
}: {
  img: string;
  n?: number;
  caption?: string;
}) {
  return (
    <div
      className="relative aspect-9/16 overflow-hidden rounded-md bg-cover bg-center ring-1 ring-white/10"
      style={{ backgroundImage: `url(${img})` }}
    >
      {n !== undefined && (
        <span className="absolute left-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-black/60 text-[7px] font-bold text-white">
          {n}
        </span>
      )}
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-1.5 pb-1.5 pt-3">
          <p className="line-clamp-2 text-[7.5px] font-semibold leading-tight text-white">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The three product mockups — matching today's real screens                  */
/* -------------------------------------------------------------------------- */

// 01 — the Generator: options bar, prompt, try-chips, collection cards.
function MockGenerator() {
  const collections = [
    { name: "Gym & Fitness", imgs: ["gym/7186296.jpg", "gym/4753890.jpg", "gym/35540076.jpg", "gym/9669473.jpg"], active: true },
    { name: "Food & Dining", imgs: ["food/36430080.jpg", "food/32525175.jpg", "food/22994309.jpg", "food/28705621.jpg"] },
    { name: "Travel", imgs: ["travel/4004016.jpg", "travel/127441.jpg", "travel/11693864.jpg", "travel/35168054.jpg"] },
  ];
  return (
    <WindowChrome
      title="What will you post today?"
      subtitle="Pick a style. Describe your idea. Go viral."
      active="Slideshows"
    >
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
        {/* options bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px]">
          {[
            ["Niche", "Gym & Fitness"],
            ["Slides", "6"],
            ["Layout", "Title + captions"],
            ["Source", "Photos"],
          ].map(([label, value]) => (
            <span key={label} className="inline-flex items-center gap-1">
              <span className="text-white/35">{label}</span>
              <span className="font-semibold text-white/85">{value}</span>
              <span className="text-white/30">▾</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-[9.5px] text-white/85">
          3 exercises to build a bigger chest fast<span className="text-accent">|</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <span className="text-[7.5px] text-white/35">Try:</span>
          {["Why our gym is different", "5 beginner mistakes"].map((s) => (
            <span key={s} className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[7.5px] text-white/60">
              {s}
            </span>
          ))}
          <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-white text-[9px] font-bold text-black">
            ↑
          </span>
        </div>
      </div>
      {/* collection cards */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        {collections.map((c) => (
          <div
            key={c.name}
            className={`relative overflow-hidden rounded-lg ${
              c.active ? "ring-2 ring-accent" : "opacity-70"
            }`}
          >
            <div className="grid aspect-[3/2] grid-cols-2 grid-rows-2">
              {c.imgs.map((img) => (
                <div
                  key={img}
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${LIB(img)})` }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
            <p className="absolute bottom-1 left-1.5 text-[7.5px] font-bold text-white">{c.name}</p>
          </div>
        ))}
      </div>
    </WindowChrome>
  );
}

// 02 — Trends: the live feed with rank, velocity, Hot today, and Remix.
function MockTrends() {
  const trends = [
    { img: LIB("gym/35540076.jpg"), rank: 1, vel: "+342k/hr", hot: true, title: "POV: day 1 vs day 180" },
    { img: LIB("cafe/2335689.jpg"), rank: 2, vel: "+118k/hr", hot: true, title: "3 drinks our regulars gatekeep" },
    { img: LIB("fashion/31870834.jpg"), rank: 3, vel: "+64k/hr", hot: false, title: "What $60 gets you here" },
    { img: LIB("beauty/11474613.jpg"), rank: 4, vel: "+51k/hr", hot: false, title: "Signs your routine isn't working" },
  ];
  return (
    <WindowChrome
      title="Trends"
      subtitle="The hottest slideshows in your niche, ranked by momentum"
      action={<PillButton variant="accent">Remix this trend</PillButton>}
      active="Trends"
    >
      <div className="grid grid-cols-4 gap-2">
        {trends.map((t) => (
          <div key={t.rank}>
            <div
              className="relative aspect-9/16 overflow-hidden rounded-md bg-cover bg-center ring-1 ring-white/10"
              style={{ backgroundImage: `url(${t.img})` }}
            >
              <span
                className={`absolute left-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full px-0.5 text-[7px] font-extrabold text-white ${
                  t.rank <= 3 ? "bg-accent" : "bg-black/60"
                }`}
              >
                #{t.rank}
              </span>
              <span className="absolute right-1 top-1 rounded-full bg-black/60 px-1 py-0.5 text-[6.5px] font-bold text-emerald-400">
                {t.vel}
              </span>
              {t.hot && (
                <span className="absolute bottom-1 left-1 rounded-full bg-amber-400/20 px-1 py-0.5 text-[6.5px] font-bold text-amber-300">
                  Hot today
                </span>
              )}
            </div>
            <p className="mt-1 line-clamp-1 text-[7.5px] font-semibold text-white">{t.title}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-md bg-accent/[0.08] p-2 ring-1 ring-accent/20">
        <p className="text-[7px] font-bold uppercase tracking-wider text-accent-text">Why it works</p>
        <p className="mt-0.5 text-[8px] leading-snug text-white/70">
          Transformation arc — viewers project themselves into slide 1 and swipe for the payoff.
        </p>
      </div>
    </WindowChrome>
  );
}

// 03 — finished slideshow: real slides, live TikTok posting.
function MockReady() {
  const tiles = [
    { img: LIB("gym/9669473.jpg"), caption: "3 exercises to build a bigger chest fast" },
    { img: LIB("gym/4753890.jpg"), caption: "1. Incline press — upper chest first" },
    { img: LIB("gym/7186296.jpg"), caption: "2. Weighted dips — full stretch reps" },
    { img: LIB("food/28705621.jpg"), caption: "Fuel it right: protein within the hour" },
    { img: LIB("gym/6389500.jpg"), caption: "3. Cable flys — squeeze at the top" },
    { img: LIB("gym/7672103.jpg"), caption: "Start today. Your day 1 is waiting →" },
  ];
  return (
    <WindowChrome
      title="Your slideshow is ready"
      subtitle="Captions stay editable until the moment you post"
      action={
        <div className="flex items-center gap-1.5">
          <PillButton>↓ Download</PillButton>
          <PillButton variant="accent">Post to TikTok</PillButton>
        </div>
      }
      active="Slideshows"
    >
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <Tile key={i} img={t.img} n={i + 1} caption={t.caption} />
        ))}
      </div>
    </WindowChrome>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature rows                                                               */
/* -------------------------------------------------------------------------- */

interface Feature {
  title: string;
  desc: string;
  mockup: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: "Describe it. Get a post-ready slideshow.",
    desc: "Pick a niche, type one line, and AI writes the hook, captions, and CTA over real photos from curated collections — 9:16, ready for TikTok.",
    mockup: <MockGenerator />,
  },
  {
    title: "See what's trending. Remix it.",
    desc: "A live chart of the fastest-climbing TikTok slideshows in your niche, with AI teardowns of why each format works — and one click remixes it into your own post.",
    mockup: <MockTrends />,
  },
  {
    title: "Post straight to TikTok",
    desc: "Connect your account and publish without leaving the app, or download the slides as a zip. Captions stay editable right up until you post.",
    mockup: <MockReady />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to go viral
          </h2>
          <p className="mt-4 text-lg text-muted">
            From a blank idea to a post-ready TikTok slideshow — without opening a
            design tool.
          </p>
        </Reveal>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {FEATURES.map((feature, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={feature.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* copy */}
                <Reveal className={reverse ? "lg:order-2" : ""}>
                  <p className="text-sm font-bold tracking-[0.3em] text-accent-text">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
                    {feature.desc}
                  </p>
                  <a
                    href="/dashboard"
                    className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/15"
                  >
                    Get started
                    <span aria-hidden>→</span>
                  </a>
                </Reveal>

                {/* mockup */}
                <Reveal
                  className={reverse ? "lg:order-1" : ""}
                  delay={120}
                >
                  {feature.mockup}
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
