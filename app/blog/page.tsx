import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, FolderOpen } from "lucide-react";

// This is a server component that fetches posts
async function getPosts(packageId?: string) {
  const params = new URLSearchParams();
  if (packageId) params.set("package_id", packageId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
      results: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }

  return res.json();
}

async function getPackages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export const metadata = {
  title: "Blog | Legacy",
  description: "Read our latest posts and updates",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { package?: string };
}) {
  const [postsData, packages] = await Promise.all([
    getPosts(searchParams.package),
    getPackages(),
  ]);

  const posts = postsData.results || [];
  const selectedPackage = packages.find(
    (p: Package) => p.id === searchParams.package
  );

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {selectedPackage ? selectedPackage.name : "Our Blog"}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-0">
            {selectedPackage
              ? selectedPackage.description || "Posts in this package"
              : "Read our latest articles, updates, and insights"}
          </p>
        </div>
      </section>

      {/* Package Filter */}
      {packages.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/blog">
                <Badge
                  variant={!selectedPackage ? "default" : "outline"}
                  className={`px-5 py-2.5 text-sm font-medium cursor-pointer transition-all ${
                    !selectedPackage
                      ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent"
                      : "border-slate-600 text-slate-300 hover:border-orange-500 hover:text-orange-400"
                  }`}
                >
                  All Posts
                </Badge>
              </Link>
              {packages.map((pkg: Package) => (
                <Link key={pkg.id} href={`/blog?package=${pkg.id}`}>
                  <Badge
                    variant={
                      selectedPackage?.id === pkg.id ? "default" : "outline"
                    }
                    className={`px-5 py-2.5 text-sm font-medium cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id
                        ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent"
                        : "border-slate-600 text-slate-300 hover:border-orange-500 hover:text-orange-400"
                    }`}
                  >
                    {pkg.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="h-16 w-16 text-slate-600 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  No posts yet
                </h3>
                <p className="text-slate-400 text-center max-w-sm">
                  Check back later for new content. We&apos;re working on
                  something great!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.package?.slug}/${post.slug}`}
                  className="block"
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/5 group h-full flex flex-col">
                    {post.featured_image ? (
                      <div className="aspect-video overflow-hidden bg-slate-900">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <FolderOpen className="w-12 h-12 text-slate-700" />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="border-orange-500/50 text-orange-400 text-xs px-2 py-0.5"
                        >
                          {post.package?.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-white group-hover:text-orange-400 transition-colors line-clamp-2 text-lg leading-snug">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col pt-0">
                      {post.excerpt && (
                        <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-700/50">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {post.author?.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
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
