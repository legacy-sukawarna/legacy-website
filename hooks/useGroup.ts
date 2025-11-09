import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

/**
 * Fetch all groups
 */
export const useGroups = () => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["groups", "list"],
    queryFn: () => api.groups.getAll(),
    enabled: !!session?.access_token,
    staleTime: 60000,
  });
};

/**
 * Fetch single group by ID
 */
export const useGroup = (id: string) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["groups", "detail", id],
    queryFn: () => api.groups.getById(id),
    enabled: !!session?.access_token && !!id,
    staleTime: 60000,
  });
};

/**
 * Create new group
 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.groups.create,
    onSuccess: () => {
      // Invalidate all group list queries
      queryClient.invalidateQueries({ queryKey: ["groups", "list"] });
    },
  });
};

/**
 * Update existing group
 */
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Group> & { id: string }) =>
      api.groups.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific group detail
      queryClient.invalidateQueries({
        queryKey: ["groups", "detail", variables.id],
      });
      // Invalidate all group lists
      queryClient.invalidateQueries({ queryKey: ["groups", "list"] });
    },
  });
};

/**
 * Delete group
 */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.groups.delete,
    onSuccess: () => {
      // Invalidate all group-related queries
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
