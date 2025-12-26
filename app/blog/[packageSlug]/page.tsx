import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, FolderOpen } from "lucide-react";

async function getPackageBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/packages/slug/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { packageSlug: string };
}) {
  const pkg = await getPackageBySlug(params.packageSlug);

  if (!pkg) {
    return {
      title: "Package Not Found | Legacy",
    };
  }

  return {
    title: `${pkg.name} | Blog | Legacy`,
    description: pkg.description || `Posts in ${pkg.name}`,
  };
}

export default async function PackagePage({
  params,
}: {
  params: { packageSlug: string };
}) {
  const pkg = await getPackageBySlug(params.packageSlug);

  if (!pkg) {
    notFound();
  }

  const posts = pkg.posts || [];

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {pkg.name}
          </h1>
          {pkg.description && (
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {pkg.description}
            </p>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-8 px-4 bg-slate-950 flex-grow">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-12 w-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No posts in this package yet
                </h3>
                <p className="text-slate-400">Check back later for new content</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/blog/${params.packageSlug}/${post.slug}`}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 group h-full">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && (
                        <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Draft"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

