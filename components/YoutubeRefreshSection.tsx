"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

import { LocalizedDate } from "@/components/LocalizedDate";
import { LocalizedText } from "@/components/LocalizedText";
import { siteConfig } from "@/config/site";
import type { YouTubeVideo } from "@/lib/youtube";

const POLL_LIVE_MS = 60_000;    // 1 min when live
const POLL_DEFAULT_MS = 300_000; // 5 min otherwise

const getVideoWatchUrl = (video: YouTubeVideo) =>
  `https://www.youtube.com/watch?v=${video.id}`;

const getVideoThumbnail = (video: YouTubeVideo) =>
  video.thumbnail || `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;

interface YoutubeRefreshSectionProps {
  initialVideos: YouTubeVideo[];
  limit?: number;
  variant?: "home" | "sermons";
}

export function YoutubeRefreshSection({
  initialVideos,
  limit = 5,
  variant = "home",
}: YoutubeRefreshSectionProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const featuredVideo = videos[0];
  const secondaryVideos = videos.slice(1);
  const isFeaturedVideoLive = featuredVideo?.liveBroadcastContent === "live";
  const hasLive = videos.some((v) => v.liveBroadcastContent === "live");

  const fetchVideos = async () => {
    // Don't poll when tab is hidden
    if (typeof document !== "undefined" && document.hidden) return;
    try {
      const res = await fetch(`/api/youtube?limit=${limit}`, { cache: "no-store" });
      if (!res.ok) return;
      const fresh = (await res.json()) as YouTubeVideo[];
      if (fresh.length > 0) setVideos(fresh);
    } catch {
      // silently ignore — show stale data rather than crashing
    }
  };

  useEffect(() => {
    const interval = hasLive ? POLL_LIVE_MS : POLL_DEFAULT_MS;

    intervalRef.current = setInterval(fetchVideos, interval);

    const handleVisibility = () => {
      if (!document.hidden) fetchVideos();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // Re-register interval whenever live state changes so cadence stays correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLive, limit]);

  if (!featuredVideo) return null;

  const embedSrc = isFeaturedVideoLive
    ? `https://www.youtube-nocookie.com/embed/${featuredVideo.id}?autoplay=1&rel=0&modestbranding=1`
    : `https://www.youtube-nocookie.com/embed/${featuredVideo.id}?rel=0&modestbranding=1`;

  return (
    <>
      <div className="legacy-featured-video-grid">
        <div className="legacy-featured-video-player">
          <iframe
            key={featuredVideo.id}
            src={embedSrc}
            title={featuredVideo.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {isFeaturedVideoLive && (
            <span className="legacy-live-badge">
              <span className="legacy-live-dot" aria-hidden="true" />
              <LocalizedText en="Live now" id="Sedang live" />
            </span>
          )}
        </div>

        <div className="legacy-featured-video-copy">
          <p className="legacy-kicker legacy-kicker-accent">
            <LocalizedText
              en={isFeaturedVideoLive ? "Broadcasting now" : "Latest from the channel"}
              id={isFeaturedVideoLive ? "Sedang tayang" : "Terbaru dari kanal"}
            />
          </p>
          <h3 className="legacy-display legacy-featured-video-title">
            {featuredVideo.title}
          </h3>
          <p className="legacy-featured-video-description">
            {featuredVideo.description || (
              <LocalizedText
                en={
                  variant === "sermons"
                    ? "Watch the latest message from Sukawarna Legacy."
                    : "Watch the latest message from Sukawarna Legacy."
                }
                id="Saksikan pesan terbaru dari Sukawarna Legacy."
              />
            )}
          </p>
          <div className="legacy-featured-video-date">
            {featuredVideo.publishedAt ? (
              <LocalizedDate value={featuredVideo.publishedAt} />
            ) : (
              <LocalizedText en="From the Legacy channel" id="Dari kanal Legacy" />
            )}
          </div>
          <a
            className="legacy-button legacy-button-primary"
            href={getVideoWatchUrl(featuredVideo)}
            target="_blank"
            rel="noreferrer"
          >
            <LocalizedText
              en={isFeaturedVideoLive ? "Watch live" : "Watch on YouTube"}
              id={isFeaturedVideoLive ? "Tonton live" : "Tonton di YouTube"}
            />
            <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>

      {secondaryVideos.length > 0 && (
        <div className="legacy-more-videos">
          <div className="legacy-more-videos-heading">
            <p className="legacy-kicker">
              <LocalizedText en="More from YouTube" id="Lainnya dari YouTube" />
            </p>
          </div>
          <div className="legacy-media-rail" role="list">
            {secondaryVideos.map((video) => (
              <a
                key={video.id}
                className="legacy-video-card"
                href={getVideoWatchUrl(video)}
                target="_blank"
                rel="noreferrer"
                role="listitem"
              >
                <div className="legacy-video-image-wrap">
                  <img
                    src={getVideoThumbnail(video)}
                    alt=""
                    className="legacy-video-image"
                  />
                  <span className="legacy-video-play" aria-hidden="true">
                    <Play size={18} fill="currentColor" />
                  </span>
                </div>
                <div className="legacy-video-meta">
                  <span className="legacy-kicker">
                    <LocalizedText
                      en={video.liveBroadcastContent === "upcoming" ? "Upcoming" : "Sermon"}
                      id={video.liveBroadcastContent === "upcoming" ? "Akan datang" : "Khotbah"}
                    />
                  </span>
                  <h3>{video.title}</h3>
                  <span>
                    {video.publishedAt ? (
                      <LocalizedDate value={video.publishedAt} />
                    ) : (
                      <LocalizedText en="Latest story" id="Cerita terbaru" />
                    )}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Separate header so the live/latest label also updates client-side
export function YoutubeRefreshHeading({
  initialVideos,
  limit = 5,
  variant = "home",
}: YoutubeRefreshSectionProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos);
  const hasLive = videos.some((v) => v.liveBroadcastContent === "live");
  const isFeaturedLive = videos[0]?.liveBroadcastContent === "live";

  useEffect(() => {
    const interval = hasLive ? POLL_LIVE_MS : POLL_DEFAULT_MS;
    const timer = setInterval(async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const res = await fetch(`/api/youtube?limit=${limit}`, { cache: "no-store" });
        if (!res.ok) return;
        const fresh = (await res.json()) as YouTubeVideo[];
        if (fresh.length > 0) setVideos(fresh);
      } catch { /* ignore */ }
    }, interval);
    return () => clearInterval(timer);
  }, [hasLive, limit]);

  return (
    <div>
      <p className="legacy-kicker">
        <LocalizedText
          en={isFeaturedLive ? "Live from YouTube" : "Latest from YouTube"}
          id={isFeaturedLive ? "Live dari YouTube" : "Terbaru di YouTube"}
        />
      </p>
      <h2 id="latest-heading" className="legacy-display legacy-section-title">
        <LocalizedText
          en={isFeaturedLive ? "Live now" : (variant === "sermons" ? "Latest message" : "Latest video")}
          id={isFeaturedLive ? "Sedang live" : (variant === "sermons" ? "Pesan terbaru" : "Video terbaru")}
        />
      </h2>
    </div>
  );
}
