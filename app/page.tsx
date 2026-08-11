import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
  Play,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocalizedDate } from "@/components/LocalizedDate";
import { LocalizedText } from "@/components/LocalizedText";
import { siteConfig } from "@/config/site";
import { getPublicPackages, getPublicPosts, type PublicPost } from "@/lib/public-content";
import { getChannelVideos, type YouTubeVideo } from "@/lib/youtube";

const getEditorialContent = async () => {
  const [postsResponse, packages] = await Promise.all([
    getPublicPosts(undefined, 3),
    getPublicPackages(),
  ]);

  return {
    posts: postsResponse.results,
    packages,
  };
};

const getVideoThumbnail = (video: YouTubeVideo) =>
  video.thumbnail || `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;

const fallbackVideos: YouTubeVideo[] = siteConfig.youtube.featuredVideos.map(
  (video) => ({
    id: video.id,
    title: video.title,
    description: "",
    publishedAt: "",
    thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
    liveBroadcastContent: "none",
  }),
);

const getPostHref = (post: PublicPost) =>
  post.package?.slug
    ? `/blog/${post.package.slug}/${post.slug}`
    : `/blog`;

const getVideoWatchUrl = (video: YouTubeVideo) =>
  `https://www.youtube.com/watch?v=${video.id}`;

const editorialFallback = {
  title: "Stories for the journey",
  excerpt:
    "A growing library of messages, reflections, and practical ways to stay attached to God and to one another.",
  image: "/assets/legacy-hero.png",
};

export const dynamic = "force-dynamic";

export default async function Index() {
  const [fetchedVideos, editorialContent] = await Promise.all([
    getChannelVideos(5),
    getEditorialContent(),
  ]);

  const youtubeVideos = fetchedVideos.length > 0 ? fetchedVideos : fallbackVideos;
  const featuredVideo = youtubeVideos[0];
  const secondaryVideos = youtubeVideos.slice(1);
  const isFeaturedVideoLive = featuredVideo?.liveBroadcastContent === "live";

  const featuredPost = editorialContent.posts[0];
  const featuredStory = featuredPost ?? editorialFallback;

  return (
    <div className="legacy-site min-h-[100dvh] overflow-hidden bg-[#0b0b0c] text-[#f4f1ea]">
      <Header />

      <main>
        <section className="legacy-hero border-b border-white/15">
          <div className="legacy-shell legacy-hero-grid">
            <div className="legacy-hero-copy">
              <p className="legacy-wordmark" aria-label="Sukawarna Legacy">
                <span className="legacy-wordmark-place">Sukawarna</span>
                <span className="legacy-wordmark-main">Legacy</span>
              </p>
              <h1 className="legacy-display legacy-hero-title">
                <LocalizedText
                  en={
                    <>
                      Attach With God,
                      <br />
                      Attach With Others
                    </>
                  }
                  id={
                    <>
                      Melekat pada Tuhan,
                      <br />
                      Melekat satu sama lain
                    </>
                  }
                />
              </h1>
              <p className="legacy-hero-description">
                <LocalizedText
                  en="A youth church community in Bandung, passionate about Jesus, people, and the next generation."
                  id="Komunitas gereja muda di Bandung yang berpusat pada Yesus, sesama, dan generasi berikutnya."
                />
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link className="legacy-button legacy-button-primary" href="#visit">
                  <LocalizedText en="Plan your visit" id="Rencanakan kunjungan" />
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <a
                  className="legacy-text-link"
                  href={siteConfig.youtube.channelUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LocalizedText en="Watch on YouTube" id="Tonton di YouTube" />
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </div>
            </div>

            <div className="legacy-hero-image-wrap">
              <Image
                src="/assets/legacy-25.jpg"
                alt="People embracing during worship at Sukawarna Legacy"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
                className="legacy-hero-image"
              />
              <div className="legacy-hero-image-note">
                <span><LocalizedText en="Saturday" id="Sabtu" /></span>
                <span>5PM WIB</span>
              </div>
            </div>
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
                    en={isFeaturedVideoLive ? "Live now" : "Latest video"}
                    id={isFeaturedVideoLive ? "Sedang live" : "Video terbaru"}
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
            ) : (
              <div className="legacy-empty-media">
                <p>
                  <LocalizedText
                    en="The latest video will appear here when the channel is connected."
                    id="Video terbaru akan muncul di sini saat kanal terhubung."
                  />
                </p>
                <a className="legacy-text-link legacy-text-link-accent" href={siteConfig.youtube.channelUrl}>
                  <LocalizedText en="Visit the channel" id="Kunjungi kanal" />
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="legacy-paper-section" aria-labelledby="stories-heading">
          <div className="legacy-shell">
            <div className="legacy-story-grid">
              <div className="legacy-story-copy">
                <p className="legacy-kicker legacy-kicker-accent">
                  <LocalizedText en="Featured story" id="Cerita pilihan" />
                </p>
                <p className="legacy-story-date">
                  {featuredPost?.published_at ? (
                    <LocalizedDate value={featuredPost.published_at} />
                  ) : (
                    <LocalizedText en="Public library" id="Pustaka publik" />
                  )}
                  <span aria-hidden="true">•</span>
                  {featuredPost?.package?.name ?? <LocalizedText en="Legacy Blog" id="Blog Legacy" />}
                </p>
                <h2 id="stories-heading" className="legacy-display legacy-story-title">
                  {featuredPost ? featuredStory.title : <LocalizedText en={editorialFallback.title} id="Cerita untuk perjalanan" />}
                </h2>
                <p className="legacy-story-excerpt">
                  {featuredPost?.excerpt ?? (
                    <LocalizedText
                      en={editorialFallback.excerpt}
                      id="Pustaka yang terus bertumbuh berisi pesan, refleksi, dan cara-cara praktis untuk tetap melekat pada Tuhan dan satu sama lain."
                    />
                  )}
                </p>
                <Link className="legacy-outline-button" href={featuredPost ? getPostHref(featuredPost) : "/blog"}>
                  {featuredPost ? (
                    <LocalizedText en="Read the story" id="Baca ceritanya" />
                  ) : (
                    <LocalizedText en="Explore the blog" id="Jelajahi blog" />
                  )}
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </div>
              <div className="legacy-story-image-wrap">
                <img
                  src={featuredPost?.featured_image ?? editorialFallback.image}
                  alt={featuredPost?.title ?? editorialFallback.title}
                  className="legacy-story-image"
                />
              </div>
            </div>

            <div className="legacy-package-section" aria-labelledby="packages-heading">
              <div className="legacy-section-heading legacy-section-heading-paper">
                <div>
                  <p className="legacy-kicker">
                    <LocalizedText en="Go deeper" id="Selami lebih dalam" />
                  </p>
                  <h2 id="packages-heading" className="legacy-display legacy-subsection-title">
                    <LocalizedText en="Packages" id="Koleksi" />
                  </h2>
                </div>
                <Link className="legacy-text-link legacy-text-link-dark" href="/blog">
                  <LocalizedText en="View the library" id="Lihat pustaka" />
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>

              <div className="legacy-package-list">
                {editorialContent.packages.length > 0 ? (
                  editorialContent.packages.slice(0, 4).map((blogPackage) => (
                    <Link
                      key={blogPackage.id}
                      href={`/blog/${blogPackage.slug}`}
                      className="legacy-package-row"
                    >
                      <BookOpen aria-hidden="true" size={24} strokeWidth={1.5} />
                      <span className="legacy-package-name">{blogPackage.name}</span>
                      <span className="legacy-package-description">
                        {blogPackage.description ?? (
                          <LocalizedText en="A collection of stories and reflections." id="Kumpulan cerita dan refleksi." />
                        )}
                      </span>
                      <span className="legacy-package-count">
                        {blogPackage._count?.posts ?? 0} <LocalizedText en="posts" id="tulisan" />
                      </span>
                      <ArrowRight aria-hidden="true" size={18} />
                    </Link>
                  ))
                ) : (
                  <Link href="/blog" className="legacy-package-row">
                    <BookOpen aria-hidden="true" size={24} strokeWidth={1.5} />
                    <span className="legacy-package-name">
                      <LocalizedText en="Legacy Blog" id="Blog Legacy" />
                    </span>
                    <span className="legacy-package-description">
                      <LocalizedText
                        en="Sermons, reflections, and resources for the road ahead."
                        id="Khotbah, refleksi, dan sumber daya untuk perjalanan ke depan."
                      />
                    </span>
                    <span className="legacy-package-count">
                      <LocalizedText en="Explore" id="Jelajahi" />
                    </span>
                    <ArrowRight aria-hidden="true" size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="visit" className="legacy-visit-section" aria-labelledby="visit-heading">
          <div className="legacy-shell legacy-visit-grid">
            <div>
              <p className="legacy-kicker legacy-kicker-accent">
                <LocalizedText en="Come as you are" id="Datang apa adanya" />
              </p>
              <h2 id="visit-heading" className="legacy-display legacy-visit-title">
                <LocalizedText en="We'd love to see you in person." id="Kami menantikan kehadiranmu." />
              </h2>
              <p className="legacy-visit-copy">
                <LocalizedText
                  en="Join us for a real encounter, real people, and a real God."
                  id="Bergabunglah untuk mengalami perjumpaan yang nyata, bersama orang-orang yang nyata, dan Tuhan yang nyata."
                />
              </p>
            </div>

            <div className="legacy-visit-card">
              <div className="legacy-visit-row">
                <CalendarDays aria-hidden="true" size={24} />
                <div>
                  <span className="legacy-kicker"><LocalizedText en="Day" id="Hari" /></span>
                  <strong><LocalizedText en={siteConfig.service.day} id="Sabtu" /></strong>
                </div>
              </div>
              <div className="legacy-visit-row">
                <Clock3 aria-hidden="true" size={24} />
                <div>
                  <span className="legacy-kicker"><LocalizedText en="Time" id="Waktu" /></span>
                  <strong>{siteConfig.service.time}</strong>
                </div>
              </div>
              <div className="legacy-visit-row legacy-visit-row-location">
                <MapPin aria-hidden="true" size={24} />
                <div>
                  <span className="legacy-kicker"><LocalizedText en="Location" id="Lokasi" /></span>
                  <strong>{siteConfig.service.location}</strong>
                  <span>{siteConfig.service.locationDetail}</span>
                  <span>{siteConfig.service.address}</span>
                </div>
              </div>
              <a
                className="legacy-button legacy-button-primary legacy-button-wide"
                href={siteConfig.service.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <LocalizedText en="Open in Maps" id="Buka di Maps" />
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
