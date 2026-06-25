// Hardcoded sample content powering the landing-page demo. This is illustrative
// only — the real app generates captions with the Claude API and pulls images
// from the product library. Keeping it here makes the demo a single source of
// truth that the <NicheDemo> client component reads from.

export type NicheId = "gym" | "food" | "fashion" | "realestate";

export interface Niche {
  id: NicheId;
  label: string;
  emoji: string;
}

export interface DemoSlide {
  /** Path to a placeholder background image under /public/demo. */
  image: string;
  /** Bold overlay caption, written in a TikTok Photo Mode voice. */
  caption: string;
}

export const NICHES: Niche[] = [
  { id: "gym", label: "Gym", emoji: "🏋️" },
  { id: "food", label: "Food", emoji: "🍔" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "realestate", label: "Real Estate", emoji: "🏡" },
];

export const DEFAULT_NICHE: NicheId = "gym";

export const DEMO_SLIDES: Record<NicheId, DemoSlide[]> = {
  gym: [
    { image: "/library/gym/gym-01.jpg", caption: "POV: you finally found a gym that feels like home" },
    { image: "/library/gym/gym-16.jpg", caption: "24/7 access. No contracts. No judgment." },
    { image: "/library/gym/gym-10.jpg", caption: "Coaching that actually moves the needle 💪" },
    { image: "/library/gym/gym-17.jpg", caption: "Your first week is on us → link in bio" },
  ],
  food: [
    { image: "/demo/food-1.svg", caption: "The smash burger everyone's driving across town for" },
    { image: "/demo/food-2.svg", caption: "Fresh, local, made to order — every single day" },
    { image: "/demo/food-3.svg", caption: "$9 lunch specials, Mon–Fri 🍔" },
    { image: "/demo/food-4.svg", caption: "Order ahead, skip the line → link in bio" },
  ],
  fashion: [
    { image: "/demo/fashion-1.svg", caption: "The drop that sold out in 48 hours is BACK" },
    { image: "/demo/fashion-2.svg", caption: "Ethically made. Built to last seasons, not weeks." },
    { image: "/demo/fashion-3.svg", caption: "Mix, match, repeat — made for your everyday" },
    { image: "/demo/fashion-4.svg", caption: "New arrivals every week → shop the link in bio" },
  ],
  realestate: [
    { image: "/demo/realestate-1.svg", caption: "This 3-bed just hit the market — and it won't last" },
    { image: "/demo/realestate-2.svg", caption: "40+ homes sold this year. Here's how we do it." },
    { image: "/demo/realestate-3.svg", caption: "Free home valuation in under 60 seconds" },
    { image: "/demo/realestate-4.svg", caption: "Thinking of selling? Let's talk → link in bio" },
  ],
};
