const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UC60FtWzckVLMnLivRRWI8kw";
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_REVALIDATE_LIVE_SECONDS = 60;    // 1 min — fast live detection
const YOUTUBE_REVALIDATE_VIDEOS_SECONDS = 300; // 5 min — regular video list

export type YouTubeBroadcastContent = "live" | "upcoming" | "none";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  liveBroadcastContent: YouTubeBroadcastContent;
}

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    liveBroadcastContent?: string;
    thumbnails?: {
      maxres?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
};

const decodeHtmlEntities = (text: string): string =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const normalizeBroadcastContent = (value: string | undefined): YouTubeBroadcastContent => {
  if (value === "live" || value === "upcoming") return value;
  return "none";
};

const getSearchVideos = async (
  maxResults: number,
  eventType?: "live",
): Promise<YouTubeVideo[]> => {
  if (!YOUTUBE_API_KEY) return [];

  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    channelId: CHANNEL_ID,
    part: "snippet",
    order: "date",
    type: "video",
    maxResults: String(maxResults),
  });

  if (eventType) params.set("eventType", eventType);

  // Live check is short-cached; regular video list refreshes every 5 min
  const fetchOptions = eventType === "live"
    ? { next: { revalidate: YOUTUBE_REVALIDATE_LIVE_SECONDS } }
    : { next: { revalidate: YOUTUBE_REVALIDATE_VIDEOS_SECONDS } };

  try {
    const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params.toString()}`, fetchOptions);

    if (!response.ok) {
      console.error("YouTube API error:", response.status);
      return [];
    }

    const data = (await response.json()) as YouTubeSearchResponse;

    return (data.items ?? []).flatMap((item) => {
      const id = item.id?.videoId;
      const snippet = item.snippet;

      if (!id || !snippet?.title) return [];

      return [{
        id,
        title: decodeHtmlEntities(snippet.title),
        description: decodeHtmlEntities(snippet.description ?? ""),
        publishedAt: snippet.publishedAt ?? "",
        thumbnail:
          snippet.thumbnails?.maxres?.url ??
          snippet.thumbnails?.high?.url ??
          snippet.thumbnails?.medium?.url ??
          snippet.thumbnails?.default?.url ??
          "",
        liveBroadcastContent: normalizeBroadcastContent(snippet.liveBroadcastContent),
      }];
    });
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);
    return [];
  }
};

export async function getChannelVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured, using fallback data");
    return [];
  }

  const [liveVideos, latestVideos] = await Promise.all([
    getSearchVideos(1, "live"),
    getSearchVideos(maxResults),
  ]);
  const seenIds = new Set<string>();

  return [...liveVideos, ...latestVideos]
    .filter((video) => {
      if (seenIds.has(video.id)) return false;
      seenIds.add(video.id);
      return true;
    })
    .slice(0, maxResults);
}
