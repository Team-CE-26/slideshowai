-- Library scale-up: product-medium tag on inspiration posts ("what is this
-- post selling/pointing to" — app, amazon affiliate, linktree, none, ...).
-- Written by the gpt-4o-mini curation pass in scripts/ingest-inspiration.mjs;
-- powers the "Browse by medium" facet in the library UI.

alter table public.inspiration_posts
  add column if not exists medium text;

create index if not exists inspiration_posts_medium_idx
  on public.inspiration_posts (medium);
