# Checkpoint: 2026-09-10

Session: kiro
Agent: kiro
Time: 22:39 WIB

## Summary
Fixed YouTube section on legacy-website public site: HTML entity decoding in titles, client-side auto-refresh polling, and switched from Search API to uploads playlist API to include live stream archives.

## Files Changed
- `lib/youtube.ts` — decode HTML entities, tiered cache, switched to playlistItems API for video list, kept Search API only for live detection
- `app/page.tsx` — replaced static server-rendered video block with `YoutubeRefreshSection` + `YoutubeRefreshHeading`
- `app/sermons/page.tsx` — same as above
- `app/api/youtube/route.ts` — new API route for client polling
- `components/YoutubeRefreshSection.tsx` — new client component with 60s (live) / 5min (default) polling + visibility change refetch

## Decisions Made
- Use uploads playlist (`UU...` ID) instead of Search API for video list — Search API silently skips live stream archives
- Keep Search API only for active live detection (it's the only API that supports `eventType=live`)
- Client polling with initial server data (no loading flash on first paint)
- 60s poll when live, 300s otherwise; also refetches on tab focus

## Blockers / Open Questions
- VPS deployment is manual (scp + docker build) — no CI/CD auto-deploy pipeline for this project yet
- Docker compose doesn't auto-load `.env.production` as build args; requires explicit `--build-arg` flags

## Next Steps
- Consider adding a GitHub Actions deploy workflow for auto-deploy on merge to main
- Store the docker build command with build args in a deploy script on the VPS
