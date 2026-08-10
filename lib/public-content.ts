import { sanitizePublicHtml } from "@/lib/content-html";

export type PublicPackage = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  _count?: { posts: number };
  posts?: PublicPost[];
};

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  package_id: string | null;
  package: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author?: {
    name: string;
    photoUrl?: string | null;
  } | null;
};

type LegacyPostPayload = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  body?: string;
  excerpt?: string | null;
  featured_image?: string | null;
  featuredImage?: string | null;
  published_at?: string | null;
  publishedAt?: string | null;
  package_id?: string | null;
  package?: LegacyPackagePayload | null;
  author?: LegacyAuthorPayload | null;
};

type LegacyAuthorPayload = {
  name?: string | null;
  photoUrl?: string | null;
};

type LegacyPackagePayload = {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  _count?: { posts: number };
  postCount?: number;
  posts?: LegacyPostPayload[];
};

type LssListResponse<T> = {
  data: T[];
  meta?: { page: number; limit: number; total: number };
};

type LegacyListResponse = {
  results?: LegacyPostPayload[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

export type PublicPostsResponse = {
  results: PublicPost[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type PublicAliasResolution =
  | {
      type: "post";
      packageSlug: string;
      postSlug: string;
      redirectCode: 301 | 308;
    }
  | {
      type: "package";
      packageSlug: string;
      redirectCode: 301 | 308;
    };

const getContentApi = () => {
  const publicSiteOnly = process.env.NEXT_PUBLIC_PUBLIC_SITE_ONLY === "true";
  if (publicSiteOnly && !process.env.NEXT_PUBLIC_CONTENT_API_URL) {
    throw new Error(
      "Public-site-only mode requires NEXT_PUBLIC_CONTENT_API_URL; refusing to render an empty legacy content fallback.",
    );
  }
  const baseUrl = publicSiteOnly
    ? process.env.NEXT_PUBLIC_CONTENT_API_URL
    : process.env.NEXT_PUBLIC_CONTENT_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return null;
  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    isLss: Boolean(process.env.NEXT_PUBLIC_CONTENT_API_URL),
  };
};

export const getPublicPackageFilter = (pkg: Pick<PublicPackage, "id" | "slug">) =>
  process.env.NEXT_PUBLIC_CONTENT_API_URL ? pkg.slug : pkg.id;

const fetchPublicJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const normalizePackage = (pkg: LegacyPackagePayload): PublicPackage => ({
  id: pkg.id,
  name: pkg.name,
  description: pkg.description ?? null,
  slug: pkg.slug,
  _count: pkg._count ?? {
    posts: pkg.postCount ?? pkg.posts?.length ?? 0,
  },
  posts: pkg.posts?.map(normalizePost),
});

const normalizePost = (post: LegacyPostPayload): PublicPost => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  content: sanitizePublicHtml(post.content ?? post.body ?? ""),
  excerpt: post.excerpt ?? null,
  featured_image: post.featured_image ?? post.featuredImage ?? null,
  published_at: post.published_at ?? post.publishedAt ?? null,
  package_id: post.package_id ?? post.package?.id ?? null,
  package: post.package ? normalizePackage(post.package) : null,
  author: post.author?.name
    ? {
        name: post.author.name,
        photoUrl: post.author.photoUrl ?? null,
      }
    : null,
});

export async function getPublicPosts(
  packageFilter?: string,
  limit = 20,
): Promise<PublicPostsResponse> {
  const api = getContentApi();
  const empty = {
    results: [],
    pagination: { page: 1, limit, total: 0, totalPages: 0 },
  } satisfies PublicPostsResponse;
  if (!api) return empty;

  const params = new URLSearchParams({ page: "1", limit: String(limit) });
  if (packageFilter) params.set(api.isLss ? "package" : "package_id", packageFilter);

  const path = api.isLss
    ? `/api/public/content/posts?${params.toString()}`
    : `/posts?${params.toString()}`;
  const payload = await fetchPublicJson<LssListResponse<LegacyPostPayload> | LegacyListResponse>(
    `${api.baseUrl}${path}`,
  );
  if (!payload) return empty;

  if (api.isLss) {
    const lssPayload = payload as LssListResponse<LegacyPostPayload>;
    const total = lssPayload.meta?.total ?? lssPayload.data.length;
    return {
      results: lssPayload.data.map(normalizePost),
      pagination: { page: 1, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  const legacyPayload = payload as LegacyListResponse;
  const pagination = legacyPayload.pagination ?? {
    page: 1,
    limit,
    total: legacyPayload.results?.length ?? 0,
    totalPages: 1,
  };
  return {
    results: (legacyPayload.results ?? []).map(normalizePost),
    pagination,
  };
}

export async function getPublicPackages(): Promise<PublicPackage[]> {
  const api = getContentApi();
  if (!api) return [];

  const path = api.isLss ? "/api/public/content/packages" : "/packages";
  const payload = await fetchPublicJson<
    LssListResponse<LegacyPackagePayload> | LegacyPackagePayload[]
  >(`${api.baseUrl}${path}`);
  if (!payload) return [];

  const packages = api.isLss
    ? (payload as LssListResponse<LegacyPackagePayload>).data
    : (payload as LegacyPackagePayload[]);
  return packages.map(normalizePackage);
}

export async function getPublicAliasResolution(
  alias: string,
): Promise<PublicAliasResolution | null> {
  const api = getContentApi();
  if (!api?.isLss) return null;

  const payload = await fetchPublicJson<{ data: PublicAliasResolution }>(
    `${api.baseUrl}/api/public/content/resolve/${encodeURIComponent(alias)}`,
  );
  return payload?.data ?? null;
}

export async function getPublicPackageBySlug(slug: string): Promise<PublicPackage | null> {
  const api = getContentApi();
  if (!api) return null;

  const path = api.isLss
    ? `/api/public/content/packages/${encodeURIComponent(slug)}`
    : `/packages/slug/${encodeURIComponent(slug)}`;
  const payload = await fetchPublicJson<{ data: LegacyPackagePayload } | LegacyPackagePayload>(
    `${api.baseUrl}${path}`,
  );
  if (!payload && api.isLss) {
    const alias = await getPublicAliasResolution(slug);
    if (alias?.type === "package") {
      const canonicalPayload = await fetchPublicJson<
        { data: LegacyPackagePayload } | LegacyPackagePayload
      >(`${api.baseUrl}/api/public/content/packages/${encodeURIComponent(alias.packageSlug)}`);
      if (canonicalPayload) {
        return normalizePackage(
          "data" in canonicalPayload ? canonicalPayload.data : canonicalPayload,
        );
      }
    }
  }
  if (!payload) return null;

  return normalizePackage("data" in payload ? payload.data : payload);
}

export async function getPublicPostBySlug(slug: string): Promise<PublicPost | null> {
  const api = getContentApi();
  if (!api) return null;

  const path = api.isLss
    ? `/api/public/content/posts/${encodeURIComponent(slug)}`
    : `/posts/slug/${encodeURIComponent(slug)}`;
  const payload = await fetchPublicJson<{ data: LegacyPostPayload } | LegacyPostPayload>(
    `${api.baseUrl}${path}`,
  );
  if (!payload && api.isLss) {
    const alias = await getPublicAliasResolution(slug);
    if (alias?.type === "post") {
      const canonicalPayload = await fetchPublicJson<
        { data: LegacyPostPayload } | LegacyPostPayload
      >(`${api.baseUrl}/api/public/content/posts/${encodeURIComponent(alias.postSlug)}`);
      if (canonicalPayload) {
        return normalizePost(
          "data" in canonicalPayload ? canonicalPayload.data : canonicalPayload,
        );
      }
    }
  }
  if (!payload) return null;

  return normalizePost("data" in payload ? payload.data : payload);
}
