-- Per-post "Why it works" teardown, written by the gpt-4o-mini curation pass
-- at ingest (lib/trends.ts → curateRows). Null = not yet curated; the feed
-- falls back to a generic line.

alter table public.trending_posts
  add column if not exists why_it_works text;
