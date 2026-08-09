import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Play, Youtube } from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedDate } from "@/components/LocalizedDate";
import { LocalizedText } from "@/components/LocalizedText";
import { siteConfig } from "@/config/site";
import { getChannelVideos, type YouTubeVideo } from "@/lib/youtube";

export const metadata = {
  title: "Sermons | Sukawarna Legacy",
  description: "Watch our latest sermons and messages",
};

export const dynamic = "force-dynamic";

const fallbackVideos: YouTubeVideo[] = siteConfig.sermons.map((sermon) => ({
  id: sermon.id,
  title: sermon.title,
  description: "",
  publishedAt: sermon.date,
  thumbnail: `https://i.ytimg.com/vi/${sermon.id}/hqdefault.jpg`,
  liveBroadcastContent: "none",
}));

const getVideoWatchUrl = (video: YouTubeVideo) =>
  `https://www.youtube.com/watch?v=${video.id}`;

const getVideoThumbnail = (video: YouTubeVideo) =>
  video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

export default async function SermonsPage() {
  const fetchedVideos = await getChannelVideos(6);
  const videos = fetchedVideos.length > 0 ? fetchedVideos : fallbackVideos;
  const featuredVideo = videos[0];
  const secondaryVideos = videos.slice(1);
  const isFeaturedVideoLive = featuredVideo?.liveBroadcastContent === "live";

  return (
    <div className="legacy-site min-h-[100dvh] bg-[var(--legacy-ink)] text-[var(--legacy-paper)]">
      <Header />

      <main>
        <section className="legacy-blog-hero">
          <div className="legacy-shell legacy-blog-hero-copy">
            <Link className="legacy-text-link" href="/">
              <ArrowLeft aria-hidden="true" size={16} />
              <LocalizedText en="Back to home" id="Kembali ke beranda" />
            </Link>
            <p className="legacy-kicker legacy-kicker-accent">
              <LocalizedText en="The Legacy channel" id="Kanal Legacy" />
            </p>
            <h1 className="legacy-display legacy-blog-title">
              <LocalizedText en="Our sermons" id="Khotbah kami" />
            </h1>
            <p className="legacy-blog-description">
              <LocalizedText
                en="Stay close to the latest messages, worship, and livestreams from Sukawarna Legacy."
                id="Tetap dekat dengan pesan, pujian, dan livestream terbaru dari Sukawarna Legacy."
              />
            </p>
            <a
              className="legacy-button legacy-button-primary"
              href={siteConfig.youtube.channelUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Youtube aria-hidden="true" size={18} />
              <LocalizedText en="Subscribe on YouTube" id="Berlangganan di YouTube" />
            </a>
          </div>
        </section>

        <section className="legacy-media-section" aria-labelledby="latest-heading">
          <div className="legacy-shell">
            <div className="legacy-section-heading">
              <div>
                <p className="legacy-kicker">
                  <LocalizedText
                    en={isFeaturedVideoLive ? "Live from YouTube" : "Latest from YouTube"}
                    id={isFeaturedVideoLive ? "Live dari YouTube" : "Terbaru di YouTube"}
                  />
                </p>
                <h2 id="latest-heading" className="legacy-display legacy-section-title">
                  <LocalizedText
                    en={isFeaturedVideoLive ? "Live now" : "Latest message"}
                    id={isFeaturedVideoLive ? "Sedang live" : "Pesan terbaru"}
                  />
                </h2>
              </div>
              <a
                className="legacy-text-link legacy-text-link-accent"
                href={siteConfig.youtube.channelUrl}
                target="_blank"
                rel="noreferrer"
              >
                <LocalizedText en="View all on YouTube" id="Lihat semua di YouTube" />
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            </div>

            {featuredVideo ? (
              <>
                <div className="legacy-featured-video-grid">
                  <div className="legacy-featured-video-player">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${featuredVideo.id}?rel=0&modestbranding=1`}
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
                          en="Watch the latest message from Sukawarna Legacy."
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
                                <LocalizedText en="From the Legacy channel" id="Dari kanal Legacy" />
                              )}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="legacy-empty-media">
                <p>
                  <LocalizedText
                    en="The latest message will appear here when the channel is connected."
                    id="Pesan terbaru akan muncul di sini saat kanal terhubung."
                  />
                </p>
                <a
                  className="legacy-text-link legacy-text-link-accent"
                  href={siteConfig.youtube.channelUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LocalizedText en="Visit the channel" id="Kunjungi kanal" />
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="legacy-paper-section" aria-labelledby="channel-heading">
          <div className="legacy-shell">
            <div className="legacy-story-copy">
              <p className="legacy-kicker legacy-kicker-accent">
                <LocalizedText en="Keep watching" id="Terus menyaksikan" />
              </p>
              <h2 id="channel-heading" className="legacy-display legacy-story-title">
                <LocalizedText en="There is more to the story." id="Masih ada cerita lainnya." />
              </h2>
              <p className="legacy-story-excerpt">
                <LocalizedText
                  en="Find the full archive of messages, worship, and special moments on our YouTube channel."
                  id="Temukan arsip lengkap pesan, pujian, dan momen spesial di kanal YouTube kami."
                />
              </p>
              <a
                className="legacy-outline-button"
                href={siteConfig.youtube.channelUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Youtube aria-hidden="true" size={17} />
                <LocalizedText en="Open the channel" id="Buka kanal" />
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
