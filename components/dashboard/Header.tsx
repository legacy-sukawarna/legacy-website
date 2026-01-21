"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LegacyLogo from "@/public/assets/legacy-logo-white.png";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const supabase = createClient();
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-4 px-6 flex justify-between items-center border-b border-orange-500/20 shadow-lg shadow-black/20">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700/50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <Link href="/" className="flex items-center group">
          <Image
            src={LegacyLogo}
            alt="Legacy Logo"
            width={80}
            height={40}
            className="h-6 w-auto transition-transform group-hover:scale-105 rounded-lg"
          />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 hidden sm:block">
          {user?.name || user?.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/50 transition-all duration-200"
          onClick={async () => {
            // First clear the user state
            clearUser();
            // Then sign out
            await supabase.auth.signOut();
            // Finally redirect
            router.push("/");
          }}
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
