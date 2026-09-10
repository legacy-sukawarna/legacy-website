import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Youtube } from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedDate } from "@/components/LocalizedDate";
import { LocalizedText } from "@/components/LocalizedText";
import { siteConfig } from "@/config/site";
import { getChannelVideos, type YouTubeVideo } from "@/lib/youtube";
import { YoutubeRefreshSection, YoutubeRefreshHeading } from "@/components/YoutubeRefreshSection";

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

export default async function SermonsPage() {
  const fetchedVideos = await getChannelVideos(6);
  const videos = fetchedVideos.length > 0 ? fetchedVideos : fallbackVideos;
  const featuredVideo = videos[0];

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
              <YoutubeRefreshHeading initialVideos={videos} limit={6} variant="sermons" />
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
              <YoutubeRefreshSection initialVideos={videos} limit={6} variant="sermons" />
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
