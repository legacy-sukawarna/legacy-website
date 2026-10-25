import type { Metadata } from "next";

export const SITE_NAME = "Sukawarna Legacy";
export const SITE_TAGLINE_TITLE = "Sukawarna Legacy — Attach With God, Attach With Others";
export const SITE_DESCRIPTION = "A youth church community in Bandung, Indonesia.";

// Vercel's VERCEL_URL is the per-deployment *.vercel.app host, which crawlers
// may not be able to reach, so production prefers the project's own domain.
const resolveSiteUrl = () => {
  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://sukawarna-legacy.web.id";
};

export const siteUrl = resolveSiteUrl();

export const defaultPreviewImage = {
  url: "/assets/legacy-preview.jpg",
  width: 1200,
  height: 630,
  alt: "Sukawarna Legacy community gathering",
};

const MAX_DESCRIPTION_LENGTH = 200;

const toDescription = (text: string) => {
  const plain = text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= MAX_DESCRIPTION_LENGTH) return plain;
  return `${plain.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
};

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  imageAlt?: string;
  article?: {
    publishedTime?: string | null;
    authors?: string[];
    section?: string;
  };
};

// Next.js replaces a parent's openGraph/twitter objects instead of merging
// them, so every page builds the full set here to keep its own title,
// description and image in link previews.
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  article,
}: PageMetadataInput): Metadata {
  const summary = toDescription(description);
  const images = image
    ? [{ url: image, alt: imageAlt ?? title }]
    : [defaultPreviewImage];

  return {
    title: title.startsWith(SITE_NAME) ? title : `${title} | ${SITE_NAME}`,
    description: summary,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      siteName: SITE_NAME,
      title,
      description: summary,
      ...(path ? { url: path } : {}),
      locale: "id_ID",
      images,
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime ?? undefined,
            authors: article.authors,
            section: article.section,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: images.map((img) => img.url),
    },
  };
}
