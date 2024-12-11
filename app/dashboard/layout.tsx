"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setUser, setSession } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // const user = localStorage.getItem("user");
    // if (user) {
    //   setUser(JSON.parse(user));
    // }

    // const getSession = async () => {
    //   const user = await supabase.auth.getSession();
    //   console.log("🚀 ~ Header ~ user:", user);
    // };

    // getSession();

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("🚀 ~ Header ~ event, session:", event, session);

      if (!session) {
        setUser(null);
        setSession(null);
        router.push("/auth/unauthorized");
      }

      if (event === "SIGNED_IN") {
        setUser(session?.user!);
        setSession(session);
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        router.push("/login");
      }
    });
  }, []);

  return (
    <div className="flex h-screen bg-foreground text-black">
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
        ></div>
      )}
    </div>
  );
}
