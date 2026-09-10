# YouTube Search API silently omits live stream archives

## Problem
Channel had recent videos (up to September 2026) but the site was showing April 2026 as the latest. The `&amp;` entity in the title confirmed the YouTube API was being called successfully, so the data was just wrong — not missing.

## Key Insight
The YouTube **Search API** (`/search?type=video&order=date`) silently skips live stream archive/replay videos. It only returns regular uploads. The **playlistItems API** with the channel's uploads playlist includes everything.

## Approach
1. Use `playlistItems` API with uploads playlist ID (`UC...` → `UU...`) for the video list
2. Keep Search API only for `eventType=live` detection (it's the only API supporting that filter)
3. Merge: live video (if any) prepended to playlist results, deduped by ID

## Gotchas
- The uploads playlist ID is the channel ID with `UC` prefix replaced by `UU` — not documented prominently
- Docker compose `env_file` does NOT pass vars as build args — must explicitly pass `--build-arg` for each `NEXT_PUBLIC_*` var at build time
- Search API costs 100 quota units per call; playlistItems costs 1 — so this is also a quota improvement

## Reusable Pattern
```typescript
// Channel uploads playlist = channel ID with UC → UU
const getUploadsPlaylistId = (channelId: string) => channelId.replace(/^UC/, "UU");

// Use playlistItems for all videos (includes live archives)
// Use search?eventType=live only for active live detection
```
