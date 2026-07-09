-- Scheduled TikTok posts: the real backing for /dashboard/schedule.
-- Queued rows are published by /api/cron/publish-scheduled (fired every
-- ~10 minutes by the GitHub Actions pinger — Vercel Hobby crons are
-- once-daily only). Owner-only RLS, same convention as tiktok_posts;
-- the publisher uses the service role.

create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slideshow_id uuid not null,
  caption text not null default '',
  privacy_level text not null default 'SELF_ONLY',
  auto_add_music boolean not null default true,
  scheduled_at timestamptz not null,
  -- queued -> publishing -> posted | failed (canceled rows are deleted)
  status text not null default 'queued',
  publish_id text,
  fail_reason text,
  created_at timestamptz not null default now(),
  posted_at timestamptz
);

create index if not exists scheduled_posts_due_idx
  on public.scheduled_posts (status, scheduled_at);
create index if not exists scheduled_posts_user_idx
  on public.scheduled_posts (user_id, scheduled_at desc);

alter table public.scheduled_posts enable row level security;

drop policy if exists "scheduled_posts_own" on public.scheduled_posts;
create policy "scheduled_posts_own" on public.scheduled_posts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
