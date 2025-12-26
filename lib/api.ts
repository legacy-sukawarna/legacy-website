import axios, { AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Get authentication headers from store
 */
function getAuthHeaders(): Record<string, string> {
  const { session } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${session?.access_token}`,
  };
}

/**
 * API client functions
 * Simple, functional approach without unnecessary abstractions
 */
export const api = {
  // Generic HTTP methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      ...config,
      headers: { ...getAuthHeaders(), ...config?.headers },
    });
    return response.data;
  },

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axios.post(`${API_URL}${endpoint}`, data, {
      ...config,
      headers: { ...getAuthHeaders(), ...config?.headers },
    });
    return response.data;
  },

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axios.put(`${API_URL}${endpoint}`, data, {
      ...config,
      headers: { ...getAuthHeaders(), ...config?.headers },
    });
    return response.data;
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      ...config,
      headers: { ...getAuthHeaders(), ...config?.headers },
    });
    return response.data;
  },

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axios.patch(`${API_URL}${endpoint}`, data, {
      ...config,
      headers: { ...getAuthHeaders(), ...config?.headers },
    });
    return response.data;
  },

  // User endpoints
  users: {
    getMe: () => api.get<User>("/users/me"),

    getAll: (params: { page: number; limit: number; search?: string }) =>
      api.get<PaginatedResponse<User>>("/users", { params }),

    getById: (id: string) => api.get<User>(`/users/${id}`),

    create: (data: Partial<User>) => api.post<User>("/users", data),

    update: (id: string, data: Partial<User>) =>
      api.put<User>(`/users/${id}`, data),

    delete: (id: string) => api.delete(`/users/${id}`),
  },

  // Group endpoints
  groups: {
    getAll: () => api.get<GroupResponse>("/connect-groups?limit=1000"),

    getById: (id: string) => api.get<Group>(`/connect-groups/${id}`),

    create: (data: Partial<Group>) => api.post<Group>("/connect-groups", data),

    update: (id: string, data: Partial<Group>) =>
      api.put<Group>(`/connect-groups/${id}`, data),

    delete: (id: string) => api.delete(`/connect-groups/${id}`),
  },

  // Connect Attendance endpoints
  connectAttendance: {
    create: (formData: FormData) =>
      api.post("/connect-attendance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    getAll: (params?: { page?: number; limit?: number }) =>
      api.get("/connect-attendance", { params }),

    getById: (id: string) => api.get(`/connect-attendance/${id}`),

    update: (id: string, formData: FormData) =>
      api.put(`/connect-attendance/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    delete: (id: string) => api.delete(`/connect-attendance/${id}`),

    getReport: (params: { start_date: string; end_date: string }) =>
      api.get<AttendanceReport>("/connect-attendance/report/data", { params }),
  },

  // Package endpoints (blog)
  packages: {
    getAll: () => api.get<Package[]>("/packages"),

    getById: (id: string) => api.get<Package>(`/packages/${id}`),

    getBySlug: (slug: string) => api.get<Package>(`/packages/slug/${slug}`),

    create: (data: CreatePackageData) => api.post<Package>("/packages", data),

    update: (id: string, data: UpdatePackageData) =>
      api.put<Package>(`/packages/${id}`, data),

    delete: (id: string) => api.delete(`/packages/${id}`),
  },

  // Post endpoints (blog)
  posts: {
    // Public endpoints
    getAll: (params?: PostQueryParams) =>
      api.get<PaginatedResponse<Post>>("/posts", { params }),

    getBySlug: (slug: string) => api.get<Post>(`/posts/slug/${slug}`),

    // Admin/Writer endpoints
    getAllAdmin: (params?: PostQueryParams) =>
      api.get<PaginatedResponse<Post>>("/posts/admin", { params }),

    getById: (id: string) => api.get<Post>(`/posts/${id}`),

    create: (data: CreatePostData) => api.post<Post>("/posts", data),

    update: (id: string, data: UpdatePostData) =>
      api.put<Post>(`/posts/${id}`, data),

    delete: (id: string) => api.delete(`/posts/${id}`),

    publish: (id: string) => api.patch<Post>(`/posts/${id}/publish`),

    unpublish: (id: string) => api.patch<Post>(`/posts/${id}/unpublish`),

    uploadImage: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post<{ url: string }>("/posts/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },
};
