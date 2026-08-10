const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UC60FtWzckVLMnLivRRWI8kw";
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_REVALIDATE_SECONDS = 600;

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

  try {
    const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params.toString()}`, {
      next: { revalidate: YOUTUBE_REVALIDATE_SECONDS },
    });

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
        title: snippet.title,
        description: snippet.description ?? "",
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
