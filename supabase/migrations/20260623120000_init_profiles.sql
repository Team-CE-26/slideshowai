-- Milestone 2 — auth data layer: profiles + RLS + signup trigger.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

-- 1) Profiles: one row per auth user, holding business info.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  business_name text,
  niche text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Row Level Security: a user can only see/edit their own profile.
alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 3) Auto-create a profile row whenever a new auth user signs up.
--    business_name is passed via signUp options.data (raw_user_meta_data).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, business_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'business_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Keep updated_at current on profile updates.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
