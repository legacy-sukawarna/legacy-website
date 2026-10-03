import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroMedia } from "@/components/HeroMedia";
import { YoutubeRefreshSection, YoutubeRefreshHeading } from "@/components/YoutubeRefreshSection";
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

            <HeroMedia key={siteConfig.heroVideo?.src ?? "photo"} video={siteConfig.heroVideo} />
          </div>
        </section>

        <section className="legacy-media-section" aria-labelledby="latest-heading">
          <div className="legacy-shell">
            <div className="legacy-section-heading">
              <YoutubeRefreshHeading initialVideos={youtubeVideos} limit={5} variant="home" />
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
              <YoutubeRefreshSection initialVideos={youtubeVideos} limit={5} variant="home" />
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

        <section id="connect" className="legacy-connect-section" aria-labelledby="connect-heading">
          <div className="legacy-shell">
            <div className="legacy-content-split">
              <div>
                <p className="legacy-kicker legacy-kicker-accent">
                  <LocalizedText en="Grow at Connect" id="Bertumbuh di Connect" />
                </p>
                <h2 id="connect-heading" className="legacy-display legacy-content-title">
                  <LocalizedText
                    en={<>Life is better<br />when we grow<br />together.</>}
                    id={<>Hidup lebih baik<br />saat kita bertumbuh<br />bersama.</>}
                  />
                </h2>
              </div>
              <div className="legacy-content-copy">
                <p>
                  <LocalizedText
                    en="CONNECT is Legacy's Christ-centered small-group community. Grounded in God's Word, we grow as disciples and make disciples — together as one family in Christ."
                    id="CONNECT adalah komunitas kelompok kecil Legacy yang berpusat pada Kristus. Berlandaskan Firman Tuhan, kita bertumbuh sebagai murid dan memuridkan — bersama sebagai satu keluarga dalam Kristus."
                  />
                </p>
                <div className="legacy-content-actions">
                  <a className="legacy-button legacy-button-primary" href={siteConfig.resources.connectRegistrationUrl} target="_blank" rel="noreferrer">
                    <span><LocalizedText en="Join our Connect" id="Bergabung di Connect" /></span>
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                  <a className="legacy-text-link legacy-text-link-dark" href={siteConfig.resources.aboutConnectUrl} target="_blank" rel="noreferrer">
                    <LocalizedText en="About Connect" id="Tentang Connect" />
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                </div>
                <p className="legacy-content-note">
                  <LocalizedText en="Registration opens in the member system. Google sign-in required." id="Pendaftaran dibuka di sistem jemaat. Masuk dengan akun Google diperlukan." />
                </p>
              </div>
            </div>
            <ul className="legacy-connect-tracks">
              <li><span className="legacy-kicker">01 / Connect</span><h3><LocalizedText en={<>High<br />School</>} id={<>Sekolah<br />Menengah</>} /></h3></li>
              <li><span className="legacy-kicker">02 / Connect</span><h3><LocalizedText en={<>College<br />/ Uni</>} id={<>Kuliah<br />/ Universitas</>} /></h3></li>
              <li><span className="legacy-kicker">03 / Connect</span><h3><LocalizedText en={<>Young Adult<br />Professional</>} id={<>Dewasa Muda<br />Profesional</>} /></h3></li>
              <li><span className="legacy-kicker">04 / Connect</span><h3><LocalizedText en={<>Couple<br />/ Family</>} id={<>Pasangan<br />/ Keluarga</>} /></h3></li>
            </ul>
          </div>
        </section>

        <section id="devotional" className="legacy-bible-section" aria-labelledby="bible-heading">
          <div className="legacy-shell legacy-content-split">
            <div>
              <p className="legacy-kicker"><LocalizedText en="Place for growth / Devotional" id="Tempat bertumbuh / Saat teduh" /></p>
              <h2 id="bible-heading" className="legacy-display legacy-content-title">
                <LocalizedText en={<>Stay in the Word.<br />Grow in community.</>} id={<>Tekun dalam Firman.<br />Bertumbuh dalam komunitas.</>} />
              </h2>
            </div>
            <div className="legacy-content-copy">
              <h3>Bible Community</h3>
              <p><LocalizedText en="Build a daily Bible-reading rhythm and track your journey with the Legacy community." id="Bangun kebiasaan membaca Alkitab setiap hari dan catat perjalananmu bersama komunitas Legacy." /></p>
              <a className="legacy-button legacy-button-light" href={siteConfig.resources.bibleCommunityUrl} target="_blank" rel="noreferrer">
                <span><LocalizedText en="Open Bible Community" id="Buka Bible Community" /></span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <p className="legacy-content-note"><LocalizedText en="Sign in to access the reading tracker." id="Masuk untuk mengakses catatan bacaan." /></p>
            </div>
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

        <section id="about" className="legacy-about-section" aria-labelledby="about-heading">
          <div className="legacy-shell">
            <div className="legacy-content-split legacy-about-intro">
              <div>
                <p className="legacy-kicker legacy-kicker-accent"><LocalizedText en="Get to know Legacy" id="Kenali Legacy" /></p>
                <h2 id="about-heading" className="legacy-display legacy-content-title">
                  <LocalizedText en={<>A place to<br />call home.</>} id={<>Tempat untuk<br />merasa di rumah.</>} />
                </h2>
              </div>
              <div className="legacy-content-copy">
                <p><LocalizedText en="Established in 2018 and part of GBI Sukawarna, Legacy brings together the next generation — from high school and university to young professionals and young families." id="Berdiri pada 2018 dan menjadi bagian dari GBI Sukawarna, Legacy menyatukan generasi berikutnya — dari pelajar dan mahasiswa hingga profesional muda dan keluarga muda." /></p>
                <p className="legacy-alive-vision">
                  <span className="legacy-kicker"><LocalizedText en="Our vision / ALIVE" id="Visi kami / ALIVE" /></span><br />
                  Attach · Love · Identity · Veil · Empower
                </p>
              </div>
            </div>
            <a className="legacy-profile-card" href={siteConfig.resources.profilePdfUrl} target="_blank" rel="noreferrer">
              <Image src="/assets/legacy-profile-2026-cover.jpg" alt="" width={990} height={1400} sizes="(max-width: 767px) 36vw, 180px" />
              <div>
                <p className="legacy-kicker legacy-kicker-accent"><LocalizedText en="Church profile / PDF / 17 pages" id="Profil gereja / PDF / 17 halaman" /></p>
                <h3><LocalizedText en="Meet Legacy." id="Kenali Legacy." /></h3>
                <p><LocalizedText en="Our vision, values, Connect community and leadership." id="Visi, nilai, komunitas Connect, dan kepemimpinan kami." /></p>
                <span className="legacy-text-link">
                  <LocalizedText en="Read the Legacy profile" id="Baca profil Legacy" />
                  <ArrowUpRight aria-hidden="true" size={16} />
                </span>
              </div>
            </a>
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
