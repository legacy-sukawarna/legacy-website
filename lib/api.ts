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

  // User endpoints
  users: {
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
};
