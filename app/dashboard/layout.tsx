"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { setupAxiosInterceptors } from "@/utils/api-interceptor";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setUser, setSession } = useAuthStore();
  const supabase = createClient();
  const { initializeAuth, setupAuthListeners } = useAuth();
  const router = useRouter();

  // Setup refresh token interceptor
  useEffect(() => {
    const interceptor = setupAxiosInterceptors({
      supabase,
      setSession,
      setUser,
      router,
    });

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Setup auth listeners and initial data
  useEffect(() => {
    const cleanup = setupAuthListeners();
    initializeAuth();
    return cleanup;
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto mx-2">
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
