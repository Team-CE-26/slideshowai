-- Slideshow persistence: metadata in Postgres, PNGs in a private Storage bucket.
-- Run in the Supabase SQL Editor. Self-contained and idempotent (safe to re-run):
-- it (re)creates the set_updated_at() helper, so it works whether or not the
-- profiles migration has been run.

-- updated_at helper (same as the profiles migration; create-or-replace is safe)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================ slideshows
create table if not exists public.slideshows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  niche text,
  description text,
  layout text,
  slide_count int,
  status text not null default 'draft' check (status in ('draft', 'saved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists slideshows_user_created_idx
  on public.slideshows (user_id, created_at desc);

alter table public.slideshows enable row level security;

drop policy if exists "Slideshows selectable by owner" on public.slideshows;
create policy "Slideshows selectable by owner" on public.slideshows
  for select using ((select auth.uid()) = user_id);

drop policy if exists "Slideshows insertable by owner" on public.slideshows;
create policy "Slideshows insertable by owner" on public.slideshows
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Slideshows updatable by owner" on public.slideshows;
create policy "Slideshows updatable by owner" on public.slideshows
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Slideshows deletable by owner" on public.slideshows;
create policy "Slideshows deletable by owner" on public.slideshows
  for delete using ((select auth.uid()) = user_id);

drop trigger if exists slideshows_set_updated_at on public.slideshows;
create trigger slideshows_set_updated_at
  before update on public.slideshows
  for each row execute function public.set_updated_at();

-- ============================================================ slides
create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  slideshow_id uuid not null references public.slideshows (id) on delete cascade,
  position int not null,
  role text,
  number int,
  caption text,
  storage_path text
);

create index if not exists slides_slideshow_idx
  on public.slides (slideshow_id, position);

alter table public.slides enable row level security;

-- slides are owned via their parent slideshow
drop policy if exists "Slides selectable by slideshow owner" on public.slides;
create policy "Slides selectable by slideshow owner" on public.slides
  for select using (
    exists (
      select 1 from public.slideshows s
      where s.id = slides.slideshow_id and s.user_id = (select auth.uid())
    )
  );

drop policy if exists "Slides insertable by slideshow owner" on public.slides;
create policy "Slides insertable by slideshow owner" on public.slides
  for insert with check (
    exists (
      select 1 from public.slideshows s
      where s.id = slides.slideshow_id and s.user_id = (select auth.uid())
    )
  );

drop policy if exists "Slides updatable by slideshow owner" on public.slides;
create policy "Slides updatable by slideshow owner" on public.slides
  for update using (
    exists (
      select 1 from public.slideshows s
      where s.id = slides.slideshow_id and s.user_id = (select auth.uid())
    )
  );

drop policy if exists "Slides deletable by slideshow owner" on public.slides;
create policy "Slides deletable by slideshow owner" on public.slides
  for delete using (
    exists (
      select 1 from public.slideshows s
      where s.id = slides.slideshow_id and s.user_id = (select auth.uid())
    )
  );

-- ============================================================ storage bucket
insert into storage.buckets (id, name, public)
values ('slideshows', 'slideshows', false)
on conflict (id) do nothing;

-- Owner-only by first path segment: objects live at `${userId}/${slideshowId}/${pos}.png`.
drop policy if exists "Slideshow objects readable by owner" on storage.objects;
create policy "Slideshow objects readable by owner" on storage.objects
  for select using (
    bucket_id = 'slideshows' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Slideshow objects insertable by owner" on storage.objects;
create policy "Slideshow objects insertable by owner" on storage.objects
  for insert with check (
    bucket_id = 'slideshows' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Slideshow objects updatable by owner" on storage.objects;
create policy "Slideshow objects updatable by owner" on storage.objects
  for update using (
    bucket_id = 'slideshows' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Slideshow objects deletable by owner" on storage.objects;
create policy "Slideshow objects deletable by owner" on storage.objects
  for delete using (
    bucket_id = 'slideshows' and (storage.foldername(name))[1] = (select auth.uid())::text
  );
