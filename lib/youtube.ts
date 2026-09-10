const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UC60FtWzckVLMnLivRRWI8kw";

// Uploads playlist = channel ID with "UC" replaced by "UU"
const getUploadsPlaylistId = (channelId: string) =>
  channelId.replace(/^UC/, "UU");

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_PLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
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

type YouTubePlaylistItem = {
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      maxres?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
    resourceId?: {
      videoId?: string;
    };
  };
};

type YouTubePlaylistResponse = {
  items?: YouTubePlaylistItem[];
};

type YouTubeSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    liveBroadcastContent?: string;
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

/**
 * Fetch latest videos via the uploads playlist.
 * This includes live stream archives that the Search API misses.
 */
const getPlaylistVideos = async (maxResults: number): Promise<YouTubeVideo[]> => {
  if (!YOUTUBE_API_KEY) return [];

  const playlistId = getUploadsPlaylistId(CHANNEL_ID);

  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    playlistId,
    part: "snippet",
    maxResults: String(maxResults),
  });

  try {
    const response = await fetch(`${YOUTUBE_PLAYLIST_URL}?${params.toString()}`, {
      next: { revalidate: YOUTUBE_REVALIDATE_VIDEOS_SECONDS },
    });

    if (!response.ok) {
      console.error("YouTube playlist API error:", response.status);
      return [];
    }

    const data = (await response.json()) as YouTubePlaylistResponse;

    return (data.items ?? []).flatMap((item) => {
      const id = item.snippet?.resourceId?.videoId;
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
        liveBroadcastContent: "none" as YouTubeBroadcastContent,
      }];
    });
  } catch (error) {
    console.error("Failed to fetch YouTube playlist:", error);
    return [];
  }
};

/**
 * Check for an active livestream. Uses Search API (only needed for live detection).
 */
const getLiveVideo = async (): Promise<YouTubeVideo | null> => {
  if (!YOUTUBE_API_KEY) return null;

  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    channelId: CHANNEL_ID,
    part: "snippet",
    eventType: "live",
    type: "video",
    maxResults: "1",
  });

  try {
    const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params.toString()}`, {
      next: { revalidate: YOUTUBE_REVALIDATE_LIVE_SECONDS },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as YouTubeSearchResponse;
    const item = data.items?.[0];
    const id = item?.id?.videoId;

    if (!id) return null;

    return {
      id,
      title: "Live now",
      description: "",
      publishedAt: new Date().toISOString(),
      thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      liveBroadcastContent: "live",
    };
  } catch {
    return null;
  }
};

export async function getChannelVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured, using fallback data");
    return [];
  }

  const [liveVideo, playlistVideos] = await Promise.all([
    getLiveVideo(),
    getPlaylistVideos(maxResults),
  ]);

  const seenIds = new Set<string>();
  const all = liveVideo ? [liveVideo, ...playlistVideos] : playlistVideos;

  return all
    .filter((video) => {
      if (seenIds.has(video.id)) return false;
      seenIds.add(video.id);
      return true;
    })
    .slice(0, maxResults);
}
