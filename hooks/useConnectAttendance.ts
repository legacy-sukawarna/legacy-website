import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

/**
 * Fetch all connect attendance records
 */
export const useConnectAttendances = (params?: {
  page?: number;
  limit?: number;
}) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["connect-attendance", "list", params],
    queryFn: () => api.connectAttendance.getAll(params),
    enabled: !!session?.access_token,
    staleTime: 30000,
  });
};

/**
 * Fetch single attendance record by ID
 */
export const useConnectAttendance = (id: string) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["connect-attendance", "detail", id],
    queryFn: () => api.connectAttendance.getById(id),
    enabled: !!session?.access_token && !!id,
    staleTime: 30000,
  });
};

/**
 * Create new attendance record
 */
export const useCreateConnectAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.connectAttendance.create,
    onSuccess: () => {
      // Invalidate all attendance list queries
      queryClient.invalidateQueries({
        queryKey: ["connect-attendance", "list"],
      });
    },
  });
};

/**
 * Update existing attendance record
 */
export const useUpdateConnectAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      api.connectAttendance.update(id, formData),
    onSuccess: (_, variables) => {
      // Invalidate the specific attendance detail
      queryClient.invalidateQueries({
        queryKey: ["connect-attendance", "detail", variables.id],
      });
      // Invalidate all attendance lists
      queryClient.invalidateQueries({
        queryKey: ["connect-attendance", "list"],
      });
    },
  });
};

/**
 * Delete attendance record
 */
export const useDeleteConnectAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.connectAttendance.delete,
    onSuccess: () => {
      // Invalidate all attendance-related queries
      queryClient.invalidateQueries({ queryKey: ["connect-attendance"] });
    },
  });
};
