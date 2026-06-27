@AGENTS.md

## TikTok Content Posting API

Endpoint: `POST https://open.tiktokapis.com/v2/post/publish/content/init/`
Mode: `DIRECT_POST`, `media_type: PHOTO`, `source: PULL_FROM_URL` (TikTok pulls images from URLs — no binary upload).
Scope: `video.publish` (despite the name, works for photos).
OAuth: standard OAuth 2.0. Authorize at `https://www.tiktok.com/v2/auth/authorize/`, exchange at `https://open.tiktokapis.com/v2/oauth/token/`. Access token: 24h. Refresh token: 365 days rolling. Client key + secret (never `NEXT_PUBLIC_`).
Status polling: `POST https://open.tiktokapis.com/v2/post/publish/status/fetch/` with `publish_id`. Statuses: `PROCESSING_DOWNLOAD`, `PUBLISH_COMPLETE`, `FAILED`.

**Critical constraints:**
- TikTok only accepts JPEG/WebP — PNG is rejected (`file_format_check_failed`). Our slides are PNGs; convert via the image proxy.
- TikTok requires domain ownership verification. Supabase's `*.supabase.co` domain cannot be verified. Solution: proxy slides through our Vercel domain (`/api/tiktok/img/[id]/[pos]`) and verify that domain in the TikTok developer portal.
- URLs must stay alive for ~1 hour after the init call (the proxy handles this naturally).
- Until TikTok audits the app, all posts are forced `SELF_ONLY` regardless of requested privacy.
- Rate limit: 6 init calls/min per user token. Max 5 pending posts per user per 24h.

**Implementation pieces (not yet built):**
1. `/api/tiktok/img/[id]/[pos]` — proxy: downloads PNG from Supabase Storage, serves as JPEG via Sharp
2. `/api/auth/tiktok` + `/api/auth/tiktok/callback` — OAuth flow, stores tokens in `tiktok_connections` table
3. `/api/tiktok/post` — calls init endpoint with proxy URLs, returns `publish_id`
4. `/api/tiktok/status` — polls TikTok status, returns to client
5. DB migration: `tiktok_connections` table (open_id, access_token, refresh_token, expires_at) per user
6. UI: "Post to TikTok" in SlideshowDetail — TikTok connect gate → caption/privacy modal → post → poll status
7. Env vars needed: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`
