-- Trend insights package (run this once in the SQL Editor):
-- 1. AI teardown columns on trending_posts — why_it_works (one-line teardown,
--    also in the earlier 20260706120000 migration, repeated here so a single
--    paste covers everything), hook_type (format label like "Transformation
--    arc"), anatomy (jsonb array of {slides, beat} slide-by-slide breakdown).
--    All written by the gpt-4o-mini curation pass at ingest.
-- 2. trend_snapshots — one row per post per refresh, the view-count history
--    behind momentum sparklines and rank movement. Public trend data:
--    readable by everyone, written only via the service role.

alter table public.trending_posts
  add column if not exists why_it_works text,
  add column if not exists hook_type text,
  add column if not exists anatomy jsonb;

create table if not exists public.trend_snapshots (
  post_id text not null,
  views bigint not null default 0,
  views_per_hour bigint not null default 0,
  captured_at timestamptz not null default now()
);

create index if not exists trend_snapshots_post_time_idx
  on public.trend_snapshots (post_id, captured_at desc);

alter table public.trend_snapshots enable row level security;

drop policy if exists "trend_snapshots_read" on public.trend_snapshots;
create policy "trend_snapshots_read" on public.trend_snapshots
  for select to anon, authenticated using (true);
