-- Per-user TikTok OAuth connection.
-- Run in the Supabase SQL Editor after 20260626120000_slide_position.sql.
-- Idempotent (safe to re-run). Relies on set_updated_at() from the slideshows migration.

create table if not exists public.tiktok_connections (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  open_id       text        not null,
  access_token  text        not null,
  refresh_token text        not null,
  expires_at    timestamptz not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id)
);

create index if not exists tiktok_connections_user_idx
  on public.tiktok_connections (user_id);

alter table public.tiktok_connections enable row level security;

drop policy if exists "TikTok connections selectable by owner" on public.tiktok_connections;
create policy "TikTok connections selectable by owner" on public.tiktok_connections
  for select using ((select auth.uid()) = user_id);

drop policy if exists "TikTok connections insertable by owner" on public.tiktok_connections;
create policy "TikTok connections insertable by owner" on public.tiktok_connections
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "TikTok connections updatable by owner" on public.tiktok_connections;
create policy "TikTok connections updatable by owner" on public.tiktok_connections
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "TikTok connections deletable by owner" on public.tiktok_connections;
create policy "TikTok connections deletable by owner" on public.tiktok_connections
  for delete using ((select auth.uid()) = user_id);

drop trigger if exists tiktok_connections_set_updated_at on public.tiktok_connections;
create trigger tiktok_connections_set_updated_at
  before update on public.tiktok_connections
  for each row execute function public.set_updated_at();
