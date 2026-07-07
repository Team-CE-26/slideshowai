// One-shot trial: does ScrapTik's keyword search return TikTok PHOTO posts
// (slideshows)? That's the go/no-go for switching the trends pipeline off
// clockworks (per-result, $3.70/1k) onto ScrapTik (per-request, $0.002).
//
//   node scripts/trial-scraptik.mjs
//
// Costs ~$0.01 on the Apify account (needs the monthly usage cap to have
// headroom). Prints a verdict plus the field shapes the adapter will need.

import { readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [
      l.slice(0, l.indexOf("=")).trim(),
      l.slice(l.indexOf("=") + 1).trim(),
    ]),
);
const token = env.APIFY_TOKEN;
if (!token) throw new Error("APIFY_TOKEN missing from .env.local");

const res = await fetch(
  `https://api.apify.com/v2/acts/scraptik~tiktok-api/run-sync-get-dataset-items?token=${token}&timeout=120`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchPosts_keyword: "gym slideshow",
      searchPosts_count: 30,
      searchPosts_region: "US",
      searchPosts_sortType: 0, // relevance
      searchPosts_publishTime: 30, // last month
    }),
  },
);
if (!res.ok) {
  console.error(`FAILED: HTTP ${res.status}`);
  console.error(await res.text());
  process.exit(1);
}
const items = await res.json();

// Search responses wrap posts as {search_item_list: [{aweme_info}]};
// profile responses use {aweme_list: [...]}.
const posts = Array.isArray(items)
  ? items.flatMap((it) => {
      if (Array.isArray(it?.search_item_list))
        return it.search_item_list.map((s) => s.aweme_info ?? s);
      if (Array.isArray(it?.aweme_list)) return it.aweme_list;
      return [it];
    })
  : [];

const photo = posts.filter(
  (p) =>
    p?.image_post_info?.images?.length > 0 ||
    p?.aweme_type === 150 || // TikTok's photo-mode type id
    p?.imagePost?.images?.length > 0,
);

console.log(`dataset items: ${items.length}, posts: ${posts.length}`);
console.log(`photo-mode posts: ${photo.length}`);
console.log(
  `VERDICT: ${photo.length > 0 ? "PASS — ScrapTik returns slideshows, safe to switch" : "FAIL — video-only, stay on clockworks"}`,
);

const sample = photo[0] ?? posts[0];
if (sample) {
  console.log("\nSample post keys:", Object.keys(sample).join(", "));
  console.log(
    "\nFields the adapter needs:",
    JSON.stringify(
      {
        id: sample.aweme_id ?? sample.id,
        desc: (sample.desc ?? "").slice(0, 80),
        create_time: sample.create_time,
        aweme_type: sample.aweme_type,
        author: sample.author?.unique_id ?? sample.author?.uniqueId,
        play_count: sample.statistics?.play_count,
        digg_count: sample.statistics?.digg_count,
        image_count: sample.image_post_info?.images?.length ?? 0,
        cover:
          sample.image_post_info?.images?.[0]?.display_image?.url_list?.[0] ??
          sample.video?.cover?.url_list?.[0] ??
          null,
        share_url: sample.share_url,
      },
      null,
      2,
    ),
  );
}

writeFileSync(
  new URL("../.scraptik-trial-raw.json", import.meta.url),
  JSON.stringify(items, null, 2),
);
console.log(
  "\nFull raw response saved to .scraptik-trial-raw.json (gitignored scratch).",
);
