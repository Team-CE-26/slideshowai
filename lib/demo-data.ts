// Hardcoded sample content powering the landing-page demo. This is illustrative
// only — the real app generates captions with the vision pipeline and pulls
// images from live Pexels. Keeping it here makes the demo a single source of
// truth that the <NicheDemo> and <SlideMarquee> components read from.
//
// Caption voice mirrors the generator's hard constraints (lib/generate/
// listicle.ts): sentence case, no exclamation marks, pattern-interrupt hooks,
// inline numbers on numbered decks, soft CTAs.

export type NicheId =
  | "gym"
  | "diet"
  | "business"
  | "saas"
  | "food"
  | "coffee"
  | "barber"
  | "shop"
  | "realty"
  | "detailing";

export interface Niche {
  id: NicheId;
  label: string;
}

export interface DemoSlide {
  /** Path to a background image under /public/demo or /public/library. */
  image: string;
  /** Bold overlay caption, written in a TikTok Photo Mode voice. */
  caption: string;
}

export const NICHES: Niche[] = [
  { id: "gym", label: "Gym" },
  { id: "food", label: "Restaurant" },
  { id: "coffee", label: "Coffee shop" },
  { id: "barber", label: "Barber" },
  { id: "shop", label: "Online shop" },
  { id: "realty", label: "Real estate" },
  { id: "detailing", label: "Detailing" },
  { id: "diet", label: "Diet" },
  { id: "business", label: "Coaching" },
  { id: "saas", label: "SaaS" },
];

export const DEFAULT_NICHE: NicheId = "gym";

export const DEMO_SLIDES: Record<NicheId, DemoSlide[]> = {
  gym: [
    { image: "/library/gym/gym-01.jpg", caption: "POV: you finally found a gym that feels like home" },
    { image: "/library/gym/gym-16.jpg", caption: "24/7 access. no contracts. no judgment." },
    { image: "/library/gym/gym-10.jpg", caption: "coaching that actually moves the needle" },
    { image: "/library/gym/gym-17.jpg", caption: "your first week is on us → link in bio" },
  ],
  food: [
    { image: "/demo/food-1.jpg", caption: "the pasta place locals keep gatekeeping" },
    { image: "/demo/food-2.jpg", caption: "every sauce starts at 7am. no shortcuts" },
    { image: "/demo/food-3.jpg", caption: "date night, solved" },
    { image: "/demo/food-4.jpg", caption: "table for two → link in bio" },
  ],
  coffee: [
    { image: "/demo/coffee-1.jpg", caption: "POV: you found the cafe you'll gatekeep forever" },
    { image: "/demo/coffee-2.jpg", caption: "beans roasted in-house every tuesday" },
    { image: "/demo/coffee-3.jpg", caption: "the flat white that ruins every other cafe for you" },
    { image: "/demo/coffee-4.jpg", caption: "first coffee's on us → link in bio" },
  ],
  barber: [
    { image: "/demo/barber-1.jpg", caption: "3 signs it's time to switch barbers" },
    { image: "/demo/barber-2.jpg", caption: "1. your fade grows out in a week" },
    { image: "/demo/barber-3.jpg", caption: "2. you book two weeks out and still wait" },
    { image: "/demo/barber-4.jpg", caption: "3. walk-ins actually welcome here → book in bio" },
  ],
  shop: [
    { image: "/demo/shop-1.jpg", caption: "we made the candle your apartment deserves" },
    { image: "/demo/shop-2.jpg", caption: "hand-poured in batches of 40, never more" },
    { image: "/demo/shop-3.jpg", caption: "burns 60 hours. smells like a cabin in october" },
    { image: "/demo/shop-4.jpg", caption: "new drop friday → link in bio" },
  ],
  realty: [
    { image: "/demo/realty-1.jpg", caption: "3 things buyers notice in the first 10 seconds" },
    { image: "/demo/realty-2.jpg", caption: "1. light sells the room before you say a word" },
    { image: "/demo/realty-3.jpg", caption: "2. kitchens close deals, not square footage" },
    { image: "/demo/realty-4.jpg", caption: "3. curb appeal decides the offer → free valuation in bio" },
  ],
  detailing: [
    { image: "/demo/detail-1.jpg", caption: "your car isn't old. it's just dirty" },
    { image: "/demo/detail-2.jpg", caption: "this interior hadn't been touched in 6 years" },
    { image: "/demo/detail-3.jpg", caption: "ceramic coat now, thank yourself in 3 winters" },
    { image: "/demo/detail-4.jpg", caption: "we come to you → book in bio" },
  ],
  diet: [
    { image: "/demo/diet-1.jpeg", caption: "3 reasons you're not as lean as you want to be" },
    { image: "/demo/diet-2.jpeg", caption: "1. you eat out too much — home-cooked protein wins" },
    { image: "/demo/diet-3.jpeg", caption: "2. you're under-eating protein. 1g per pound, every day" },
    { image: "/demo/diet-4.jpeg", caption: "3. no plan = no progress. meal plan in bio" },
  ],
  business: [
    { image: "/demo/golf-1.jpeg", caption: "3 reasons you're not getting better at golf" },
    { image: "/demo/golf-2.jpeg", caption: "1. your setup kills the shot before you swing" },
    { image: "/demo/golf-3.jpeg", caption: "2. no feedback loop. a coach fixes in one lesson what youtube can't in a year" },
    { image: "/demo/golf-4.jpeg", caption: "3. you beat balls with no plan → book a lesson, link in bio" },
  ],
  saas: [
    { image: "/demo/saas-1.jpeg", caption: "3 things that finally made me productive" },
    { image: "/demo/saas-2.jpeg", caption: "1. i finished my to-do list by putting it all in one place" },
    { image: "/demo/saas-3.jpeg", caption: "2. i track my focus instead of guessing where my time goes" },
    { image: "/demo/saas-4.jpeg", caption: "3. ten minutes of reflection a day. all in one app → free in bio" },
  ],
};
