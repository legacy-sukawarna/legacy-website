import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getChannelVideos } from "@/lib/youtube";
import { Youtube, ArrowLeft, Calendar } from "lucide-react";

export const metadata = {
  title: "Sermons | Legacy",
  description: "Watch our latest sermons and messages",
};

export default async function SermonsPage() {
  // Fetch videos from YouTube API
  const youtubeVideos = await getChannelVideos(6);

  // Use YouTube data if available, otherwise fall back to config
  const videos =
    youtubeVideos.length > 0
      ? youtubeVideos.map((video) => ({
          id: video.id,
          title: video.title,
          date: video.publishedAt,
        }))
      : siteConfig.sermons.map((sermon) => ({
          id: sermon.id,
          title: sermon.title,
          date: sermon.date,
        }));

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950">
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Sermons
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Catch up on our messages and be inspired by God&apos;s word
            </p>
            <a
              href={siteConfig.youtube.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Youtube className="w-5 h-5 mr-2" />
                Subscribe on YouTube
              </Button>
            </a>
          </div>
        </section>

        {/* Sermons Grid */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <Card
                  key={video.id || index}
                  className="bg-slate-800/50 border-slate-700/50 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(video.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* More on YouTube CTA */}
            <div className="mt-12 text-center pb-8">
              <p className="text-slate-400 mb-4">
                Want to see more? Check out our YouTube channel for all our
                sermons.
              </p>
              <a
                href={siteConfig.youtube.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Youtube className="w-5 h-5 mr-2" />
                  View All on YouTube
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
