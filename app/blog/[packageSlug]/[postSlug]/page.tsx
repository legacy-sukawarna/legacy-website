import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";

async function getPostBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${slug}`,
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
  params: { packageSlug: string; postSlug: string };
}) {
  const post = await getPostBySlug(params.postSlug);

  if (!post) {
    return {
      title: "Post Not Found | Legacy",
    };
  }

  return {
    title: `${post.title} | Legacy`,
    description: post.excerpt || `Read ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { packageSlug: string; postSlug: string };
}) {
  const post = await getPostBySlug(params.postSlug);

  if (!post || post.package?.slug !== params.packageSlug) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950">
      <Header />

      {/* Article */}
      <article className="flex-grow">
        {/* Hero */}
        <header className="pt-8 md:pt-12 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Link
                href={`/blog?package=${post.package_id}`}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {post.package?.name}
              </Link>
              <Badge
                variant="outline"
                className="border-orange-500/50 text-orange-400 px-3 py-1"
              >
                {post.package?.name}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-slate-400 text-sm md:text-base">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" />
                {post.author?.name}
              </span>
              {post.published_at && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="blog-content text-slate-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author & Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t border-slate-800 pt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    {post.author?.name}
                  </p>
                  <p className="text-slate-400 text-sm">Author</p>
                </div>
              </div>
              <Link
                href={`/blog?package=${post.package_id}`}
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium flex items-center gap-2"
              >
                More from {post.package?.name}
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
