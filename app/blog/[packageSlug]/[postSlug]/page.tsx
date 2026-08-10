import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";

import BlogArticleContent from "@/components/BlogArticleContent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedDate } from "@/components/LocalizedDate";
import { LocalizedText } from "@/components/LocalizedText";
import { getPublicPackageFilter, getPublicPostBySlug } from "@/lib/public-content";

export async function generateMetadata({
  params,
}: {
  params: { packageSlug: string; postSlug: string };
}) {
  const post = await getPublicPostBySlug(params.postSlug);

  if (!post) {
    return { title: "Post Not Found | Sukawarna Legacy" };
  }

  return {
    title: `${post.title} | Sukawarna Legacy`,
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
  const post = await getPublicPostBySlug(params.postSlug);

  if (!post || !post.package) notFound();

  if (post.package.slug !== params.packageSlug || post.slug !== params.postSlug) {
    permanentRedirect(`/blog/${post.package.slug}/${post.slug}`);
  }

  const packageFilter = getPublicPackageFilter(post.package);
  const packageName = post.package.name;
  const authorName = post.author?.name;

  return (
    <div className="legacy-site min-h-[100dvh] bg-[var(--legacy-ink)] text-[var(--legacy-paper)]">
      <Header />

      <main>
        <article>
          <header className="legacy-article-header">
            <div className="legacy-shell">
              <Link className="legacy-text-link" href={`/blog?package=${packageFilter}`}>
                <ArrowLeft aria-hidden="true" size={16} />
                <LocalizedText en={`Back to ${packageName}`} id={`Kembali ke ${packageName}`} />
              </Link>

              <div className="legacy-article-heading">
                <p className="legacy-kicker legacy-kicker-accent">{packageName}</p>
                <h1 className="legacy-display legacy-article-title">{post.title}</h1>
                {post.excerpt && <p className="legacy-article-excerpt">{post.excerpt}</p>}
                <div className="legacy-article-meta">
                  {authorName && (
                    <span>
                      <User size={14} aria-hidden="true" />
                      {authorName}
                    </span>
                  )}
                  {post.published_at && (
                    <span>
                      <Calendar size={14} aria-hidden="true" />
                      <LocalizedDate value={post.published_at} month="long" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          <BlogArticleContent
            html={post.content}
            featuredImage={post.featured_image}
            featuredAlt={post.title}
          />

          <section className="legacy-article-body-section legacy-article-footer-section">
            <div className="legacy-shell">
              <footer className="legacy-article-footer">
                {authorName && (
                  <div>
                    <p className="legacy-kicker legacy-kicker-accent">
                      <LocalizedText en="Written by" id="Ditulis oleh" />
                    </p>
                    <p className="legacy-article-author">{authorName}</p>
                  </div>
                )}
                <Link className="legacy-text-link legacy-text-link-dark" href={`/blog?package=${packageFilter}`}>
                  <LocalizedText en={`More from ${packageName}`} id={`Lainnya dari ${packageName}`} />
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </footer>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
