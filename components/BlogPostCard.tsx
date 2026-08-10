import Link from "next/link";
import { ArrowUpRight, Calendar, FolderOpen, User } from "lucide-react";

import { LocalizedDate } from "@/components/LocalizedDate";
import { LocalizedText } from "@/components/LocalizedText";
import type { PublicPost } from "@/lib/public-content";

type BlogPostCardProps = {
  post: PublicPost;
  packageSlug?: string;
};

export const BlogPostCard = ({ post, packageSlug }: BlogPostCardProps) => {
  const resolvedPackageSlug = packageSlug || post.package?.slug;
  const href = resolvedPackageSlug
    ? `/blog/${resolvedPackageSlug}/${post.slug}`
    : "/blog";

  return (
    <Link className="legacy-blog-card group" href={href}>
      <div className="legacy-blog-card-image-wrap">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="legacy-blog-card-image"
          />
        ) : (
          <div className="legacy-blog-card-placeholder" aria-hidden="true">
            <FolderOpen size={34} strokeWidth={1.25} />
          </div>
        )}
        <span className="legacy-blog-card-arrow" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="legacy-blog-card-body">
        <div className="legacy-blog-card-kicker">
          {post.package?.name || <LocalizedText en="Legacy Blog" id="Blog Legacy" />}
        </div>
        <h2 className="legacy-blog-card-title">{post.title}</h2>
        {post.excerpt && <p className="legacy-blog-card-excerpt">{post.excerpt}</p>}
        <div className="legacy-blog-card-meta">
          {post.author?.name && (
            <span>
              <User size={13} aria-hidden="true" />
              {post.author.name}
            </span>
          )}
          <span>
            <Calendar size={13} aria-hidden="true" />
            {post.published_at ? (
              <LocalizedDate value={post.published_at} />
            ) : (
              <LocalizedText en="Draft" id="Draf" />
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
