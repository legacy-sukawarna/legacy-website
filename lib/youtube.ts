const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UC60FtWzckVLMnLivRRWI8kw";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

export async function getChannelVideos(
  maxResults = 12
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured, using fallback data");
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&` +
        `part=snippet&order=date&type=video&maxResults=${maxResults}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error("YouTube API error:", response.status);
      return [];
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);
    return [];
  }
}
