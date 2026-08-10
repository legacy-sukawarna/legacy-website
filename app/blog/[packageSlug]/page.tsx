import Link from "next/link";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";

import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedText } from "@/components/LocalizedText";
import { getPublicPackageBySlug } from "@/lib/public-content";

export async function generateMetadata({
  params,
}: {
  params: { packageSlug: string };
}) {
  const pkg = await getPublicPackageBySlug(params.packageSlug);

  if (!pkg) {
    return { title: "Package Not Found | Sukawarna Legacy" };
  }

  return {
    title: `${pkg.name} | Blog | Sukawarna Legacy`,
    description: pkg.description || `Posts in ${pkg.name}`,
  };
}

export default async function PackagePage({
  params,
}: {
  params: { packageSlug: string };
}) {
  const pkg = await getPublicPackageBySlug(params.packageSlug);

  if (!pkg) notFound();
  if (pkg.slug !== params.packageSlug) permanentRedirect(`/blog/${pkg.slug}`);

  const posts = pkg.posts || [];

  return (
    <div className="legacy-site min-h-[100dvh] bg-[var(--legacy-ink)] text-[var(--legacy-paper)]">
      <Header />

      <main>
        <section className="legacy-blog-hero legacy-blog-hero-package">
          <div className="legacy-shell">
            <Link className="legacy-text-link" href="/blog">
              <ArrowLeft aria-hidden="true" size={16} />
              <LocalizedText en="Back to blog" id="Kembali ke blog" />
            </Link>
            <div className="legacy-blog-hero-copy">
              <p className="legacy-kicker legacy-kicker-accent">
                <LocalizedText en="Collection" id="Koleksi" />
              </p>
              <h1 className="legacy-display legacy-blog-title">{pkg.name}</h1>
              {pkg.description && <p className="legacy-blog-description">{pkg.description}</p>}
            </div>
          </div>
        </section>

        <section className="legacy-blog-index" aria-labelledby="package-posts-heading">
          <div className="legacy-shell">
            <div className="legacy-section-heading legacy-section-heading-paper">
              <div>
                <p className="legacy-kicker legacy-kicker-accent">
                  <LocalizedText en="From this collection" id="Dari koleksi ini" />
                </p>
                <h2 id="package-posts-heading" className="legacy-display legacy-subsection-title">
                  <LocalizedText en="Stories" id="Cerita" />
                </h2>
              </div>
              <span className="legacy-blog-result-count">
                {posts.length} <LocalizedText en="stories" id="cerita" />
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="legacy-blog-empty">
                <FolderOpen aria-hidden="true" size={34} strokeWidth={1.25} />
                <h3>
                  <LocalizedText
                    en="No posts in this collection yet"
                    id="Belum ada tulisan di koleksi ini"
                  />
                </h3>
                <p>
                  <LocalizedText
                    en="Check back later for something new."
                    id="Kunjungi lagi nanti untuk sesuatu yang baru."
                  />
                </p>
              </div>
            ) : (
              <div className="legacy-blog-grid">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} packageSlug={pkg.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
