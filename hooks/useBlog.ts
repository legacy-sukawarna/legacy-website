import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// ============ Package Hooks ============

/**
 * Fetch all packages (public)
 */
export const usePackages = () => {
  return useQuery({
    queryKey: ["packages", "list"],
    queryFn: () => api.packages.getAll(),
    staleTime: 60000,
  });
};

/**
 * Fetch single package by ID
 */
export const usePackage = (id: string) => {
  return useQuery({
    queryKey: ["packages", "detail", id],
    queryFn: () => api.packages.getById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

/**
 * Fetch package by slug (public)
 */
export const usePackageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["packages", "slug", slug],
    queryFn: () => api.packages.getBySlug(slug),
    enabled: !!slug,
    staleTime: 60000,
  });
};

/**
 * Create new package (ADMIN only)
 */
export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.packages.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages", "list"] });
    },
  });
};

/**
 * Update package (ADMIN only)
 */
export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePackageData & { id: string }) =>
      api.packages.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["packages", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["packages", "list"] });
    },
  });
};

/**
 * Delete package (ADMIN only)
 */
export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.packages.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};

// ============ Post Hooks ============

/**
 * Fetch published posts (public)
 */
export const usePosts = (params?: PostQueryParams) => {
  return useQuery({
    queryKey: ["posts", "list", params],
    queryFn: () => api.posts.getAll(params),
    staleTime: 30000,
  });
};

/**
 * Fetch all posts including drafts (ADMIN/WRITER)
 */
export const usePostsAdmin = (params?: PostQueryParams) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["posts", "admin", params],
    queryFn: () => api.posts.getAllAdmin(params),
    enabled: !!session?.access_token,
    staleTime: 30000,
  });
};

/**
 * Fetch post by slug (public)
 */
export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["posts", "slug", slug],
    queryFn: () => api.posts.getBySlug(slug),
    enabled: !!slug,
    staleTime: 30000,
  });
};

/**
 * Fetch post by ID (ADMIN/WRITER)
 */
export const usePost = (id: string) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: () => api.posts.getById(id),
    enabled: !!session?.access_token && !!id,
    staleTime: 30000,
  });
};

/**
 * Create new post (ADMIN/WRITER)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.posts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * Update post (ADMIN/WRITER)
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePostData & { id: string }) =>
      api.posts.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * Delete post (ADMIN/WRITER)
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.posts.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * Publish post (ADMIN/WRITER)
 */
export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.posts.publish,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * Unpublish post (ADMIN/WRITER)
 */
export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.posts.unpublish,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * Upload image for post content
 */
export const useUploadImage = () => {
  return useMutation({
    mutationFn: api.posts.uploadImage,
  });
};

