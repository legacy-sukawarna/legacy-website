import Link from "next/link";
import { ArrowLeft, ArrowRight, FolderOpen } from "lucide-react";

import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedText } from "@/components/LocalizedText";
import {
  getPublicPackageFilter,
  getPublicPackages,
  getPublicPosts,
  type PublicPackage,
} from "@/lib/public-content";

export const metadata = {
  title: "Blog | Sukawarna Legacy",
  description: "Read our latest posts and updates",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { package?: string };
}) {
  const [postsData, packages] = await Promise.all([
    getPublicPosts(searchParams.package, 20),
    getPublicPackages(),
  ]);

  const posts = postsData.results;
  const selectedPackage = packages.find(
    (pkg: PublicPackage) =>
      pkg.id === searchParams.package || pkg.slug === searchParams.package,
  );

  return (
    <div className="legacy-site min-h-[100dvh] bg-[var(--legacy-ink)] text-[var(--legacy-paper)]">
      <Header />

      <main>
        <section className="legacy-blog-hero">
          <div className="legacy-shell">
            <Link className="legacy-text-link" href="/">
              <ArrowLeft aria-hidden="true" size={16} />
              <LocalizedText en="Back to home" id="Kembali ke beranda" />
            </Link>
            <div className="legacy-blog-hero-copy">
              <p className="legacy-kicker legacy-kicker-accent">
                <LocalizedText en="The editorial library" id="Pustaka editorial" />
              </p>
              <h1 className="legacy-display legacy-blog-title">
                {selectedPackage ? selectedPackage.name : <LocalizedText en="Our blog" id="Blog kami" />}
              </h1>
              <p className="legacy-blog-description">
                {selectedPackage
                  ? selectedPackage.description || (
                      <LocalizedText
                        en="Thoughts and stories from this collection."
                        id="Gagasan dan cerita dari koleksi ini."
                      />
                    )
                  : (
                      <LocalizedText
                        en="Messages, reflections, and practical ways to stay attached to God and to one another."
                        id="Pesan, refleksi, dan cara-cara praktis untuk tetap melekat pada Tuhan dan satu sama lain."
                      />
                    )}
              </p>
            </div>
          </div>
        </section>

        {packages.length > 0 && (
          <section className="legacy-blog-filter-section" aria-label="Blog collections">
            <div className="legacy-shell">
              <div className="legacy-blog-filter-label">
                <span className="legacy-kicker">
                  <LocalizedText en="Browse by collection" id="Jelajahi berdasarkan koleksi" />
                </span>
                <ArrowRight aria-hidden="true" size={16} />
              </div>
              <nav className="legacy-blog-filters" aria-label="Blog collections">
                <Link className={!selectedPackage ? "is-active" : undefined} href="/blog">
                  <LocalizedText en="All posts" id="Semua tulisan" />
                </Link>
                {packages.map((pkg: PublicPackage) => (
                  <Link
                    key={pkg.id}
                    className={selectedPackage?.id === pkg.id ? "is-active" : undefined}
                    href={`/blog?package=${getPublicPackageFilter(pkg)}`}
                  >
                    {pkg.name}
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        )}

        <section className="legacy-blog-index" aria-labelledby="blog-index-heading">
          <div className="legacy-shell">
            <div className="legacy-section-heading legacy-section-heading-paper">
              <div>
                <p className="legacy-kicker legacy-kicker-accent">
                  <LocalizedText en="Read at your own pace" id="Baca sesuai waktumu" />
                </p>
                <h2 id="blog-index-heading" className="legacy-display legacy-subsection-title">
                  {selectedPackage ? selectedPackage.name : <LocalizedText en="Latest stories" id="Cerita terbaru" />}
                </h2>
              </div>
              <span className="legacy-blog-result-count">
                {postsData.pagination.total} <LocalizedText en="stories" id="cerita" />
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="legacy-blog-empty">
                <FolderOpen aria-hidden="true" size={34} strokeWidth={1.25} />
                <h3>
                  <LocalizedText en="No posts yet" id="Belum ada tulisan" />
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
                  <BlogPostCard key={post.id} post={post} />
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
