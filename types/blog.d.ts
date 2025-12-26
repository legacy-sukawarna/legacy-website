type PostStatus = "DRAFT" | "PUBLISHED";

type Package = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  posts?: Post[];
  _count?: {
    posts: number;
  };
};

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: PostStatus;
  package_id: string;
  package?: Package;
  author_id: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
};

type CreatePackageData = {
  name: string;
  description?: string;
  slug?: string;
};

type UpdatePackageData = {
  name?: string;
  description?: string;
  slug?: string;
};

type CreatePostData = {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  package_id: string;
};

type UpdatePostData = {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  package_id?: string;
};

type PostQueryParams = {
  package_id?: string;
  status?: PostStatus;
  author_id?: string;
  search?: string;
  page?: number;
  limit?: number;
};

