import axios from "axios";

// Type the parameters properly
interface InterceptorDependencies {
  supabase: any;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  router: any;
}

// Separate the token refresh logic
export const refreshAccessToken = async (
  supabase: any,
  setSession: (session: any) => void
) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error) throw error;

  setSession(session);
  localStorage.setItem("session", JSON.stringify(session));

  return session;
};

// Setup axios interceptor
export const setupAxiosInterceptors = ({
  supabase,
  setSession,
  setUser,
  router,
}: InterceptorDependencies) => {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newSession = await refreshAccessToken(supabase, setSession);
          originalRequest.headers.Authorization = `Bearer ${newSession?.access_token}`;
          return axios(originalRequest);
        } catch (error) {
          // Logout user on refresh failure
          setUser(null);
          setSession(null);
          router.push("/login");
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return interceptor;
};
