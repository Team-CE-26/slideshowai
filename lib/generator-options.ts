// Static options powering the dashboard generator UI. This is mockup data only —
// no generation is wired up yet. Gradient class strings are written out in full
// so Tailwind's scanner picks them up.

export const LAYOUTS = [
  { value: "title-captions", label: "Title slide + captions" },
  { value: "captions-only", label: "Captions only" },
  { value: "hook-bullets", label: "Hook + bullet points" },
  { value: "quote-cards", label: "Quote cards" },
];

export const SLIDE_COUNTS = [3, 4, 5, 6, 7, 8, 9, 10];
export const SLIDESHOW_COUNTS = [1, 2, 3, 5];

export const GENERATOR_NICHES = [
  { value: "gym", label: "🏋️ Gym & Fitness" },
  { value: "food", label: "🍔 Food & Dining" },
  { value: "fashion", label: "👗 Fashion & Apparel" },
  { value: "realestate", label: "🏡 Real Estate" },
  { value: "beauty", label: "💄 Beauty & Skincare" },
  { value: "cafe", label: "☕ Cafe & Coffee" },
  { value: "ecommerce", label: "🛍️ Ecommerce / Product" },
];

export interface ImageModel {
  id: string;
  name: string;
  desc: string;
  badge?: string;
}

export const IMAGE_MODELS: ImageModel[] = [
  { id: "standard", name: "Standard", desc: "Fast — great for most slideshows", badge: "Default" },
  { id: "ultra", name: "Ultra", desc: "Highest quality, uses more credits per slide" },
];

export interface Collection {
  id: string;
  name: string;
  count: number;
  gradient: string;
  emojis: [string, string, string, string];
}

export const COLLECTIONS: Collection[] = [
  { id: "gym", name: "Gym & Fitness", count: 48, gradient: "from-indigo-600 to-sky-500", emojis: ["🏋️", "🔥", "💪", "🏃"] },
  { id: "food", name: "Food & Dining", count: 52, gradient: "from-amber-600 to-rose-500", emojis: ["🍔", "🍜", "🥗", "🍰"] },
  { id: "fashion", name: "Fashion & Apparel", count: 60, gradient: "from-fuchsia-600 to-violet-500", emojis: ["👗", "👜", "🕶️", "👟"] },
  { id: "realestate", name: "Real Estate", count: 40, gradient: "from-teal-600 to-emerald-500", emojis: ["🏡", "🔑", "🏙️", "🛋️"] },
  { id: "beauty", name: "Beauty & Skincare", count: 50, gradient: "from-rose-500 to-pink-400", emojis: ["💄", "🧴", "💅", "✨"] },
  { id: "luxury", name: "Dark Luxury", count: 30, gradient: "from-zinc-700 to-amber-600", emojis: ["⌚", "🥂", "💎", "🖤"] },
  { id: "cafe", name: "Cafe & Coffee", count: 28, gradient: "from-amber-800 to-orange-500", emojis: ["☕", "🥐", "🫖", "🍪"] },
  { id: "tech", name: "Tech & Gadgets", count: 36, gradient: "from-cyan-600 to-blue-600", emojis: ["💻", "📱", "🎧", "⌨️"] },
  { id: "travel", name: "Travel & Hospitality", count: 44, gradient: "from-sky-500 to-indigo-500", emojis: ["✈️", "🏝️", "🧳", "🗺️"] },
];

export interface Style {
  id: string;
  name: string;
  gradient: string;
  emoji: string;
}

export const STYLES: Style[] = [
  { id: "photo", name: "Realistic Photography", gradient: "from-slate-600 to-slate-900", emoji: "📷" },
  { id: "studio", name: "Studio Product", gradient: "from-zinc-500 to-zinc-800", emoji: "🪞" },
  { id: "bold", name: "Bold & Minimal", gradient: "from-indigo-600 to-fuchsia-600", emoji: "🔲" },
  { id: "anime", name: "Anime / Ghibli", gradient: "from-sky-500 to-emerald-400", emoji: "🌸" },
  { id: "vintage", name: "Vintage Film", gradient: "from-amber-700 to-rose-700", emoji: "🎞️" },
  { id: "render", name: "3D Render", gradient: "from-violet-600 to-cyan-500", emoji: "🧊" },
];

export const PINNED_TEMPLATES = [
  "Why our gym is different",
  "New menu launch",
  "3 reasons to book a viewing",
];
