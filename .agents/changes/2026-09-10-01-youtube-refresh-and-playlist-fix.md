# YouTube Section: Auto-refresh, HTML entity fix, uploads playlist

Session: kiro
Date: 2026-09-10 22:39 WIB

## Changes
- `lib/youtube.ts`: Added `decodeHtmlEntities()` for `&amp;` etc. Switched video list from Search API to playlistItems API (uploads playlist `UU...`). Kept Search API only for live detection. Tiered cache: 60s live, 300s videos.
- `app/api/youtube/route.ts`: New thin API endpoint for client-side polling.
- `components/YoutubeRefreshSection.tsx`: New client component — hydrates from server data, polls `/api/youtube` at 60s (live) or 300s (default), refetches on tab visibility change.
- `app/page.tsx` + `app/sermons/page.tsx`: Replaced static video block with `YoutubeRefreshSection` + `YoutubeRefreshHeading`. Removed unused imports/vars.

## Context
User reported `&amp;` appearing in video titles and videos not auto-refreshing. Root cause investigation revealed the Search API also silently omits live stream archive videos — switching to the uploads playlist (playlistItems API) fixed the stale April content showing instead of September videos.

PR: https://github.com/legacy-sukawarna/legacy-website/pull/5 (merged)
Deployed manually to VPS via scp + docker compose build with explicit build args.
