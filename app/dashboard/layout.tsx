"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Session, User } from "@supabase/supabase-js";

// Separate the token refresh logic
const refreshAccessToken = async (supabase: any, setSession: any) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error) throw error;

  setSession(session);
  localStorage.setItem("session", JSON.stringify(session));

  return session;
};

// Separate the axios interceptor setup
const setupAxiosInterceptors = (
  supabase: any,
  setSession: any,
  setUser: any,
  router: any
) => {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setUser, setSession } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();

  // Setup refresh token interceptor
  useEffect(() => {
    const interceptor = setupAxiosInterceptors(
      supabase,
      setSession,
      setUser,
      router
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  async function fetchUserByUUID() {
    const user: User = JSON.parse(localStorage.getItem("user") || "{}");
    const session: Session = JSON.parse(
      localStorage.getItem("session") || "{}"
    );

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      console.log(response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      if (error.response.status === 403) {
        router.push("/login");
      }
      throw error;
    }
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_OUT") {
      setUser(null);
      setSession(null);
      router.push("/login");
    }
  });

  useEffect(() => {
    const getUserDataSession = async () => {
      const session = await supabase.auth.getSession();
      const user = await supabase.auth.getUser();
      setSession(session.data.session);

      localStorage.setItem("user", JSON.stringify(user.data.user));
      localStorage.setItem("session", JSON.stringify(session.data.session));

      await fetchUserByUUID();
    };

    getUserDataSession();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto mx-2 ">
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
