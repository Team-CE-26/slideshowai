-- Public bucket for cached TikTok trend covers. TikTok CDN cover URLs are
-- signed and expire within ~a day; the trends cron (lib/trends.ts →
-- cacheCovers) copies each kept post's cover here so cards never go black.
-- Public read is intentional (same data TikTok serves publicly); writes go
-- through the service role only, which bypasses RLS.

insert into storage.buckets (id, name, public)
values ('trend-covers', 'trend-covers', true)
on conflict (id) do update set public = true;
