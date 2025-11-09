import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

/**
 * Fetch paginated users
 */
export const useUsers = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => api.users.getAll(params),
    enabled: !!session?.access_token,
    staleTime: 30000,
  });
};

/**
 * Fetch single user by ID
 */
export const useUser = (id: string) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => api.users.getById(id),
    enabled: !!session?.access_token && !!id,
    staleTime: 30000,
  });
};

/**
 * Create new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.users.create,
    onSuccess: () => {
      // Invalidate all user list queries
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
};

/**
 * Update existing user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<User> & { id: string }) =>
      api.users.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific user detail
      queryClient.invalidateQueries({
        queryKey: ["users", "detail", variables.id],
      });
      // Invalidate all user lists
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
};

/**
 * Delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.users.delete,
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
