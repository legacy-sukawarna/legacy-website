import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const supabase = createClient();
  const { user, clearUser } = useAuthStore();

  return (
    <header className="shadow-md py-4 px-6 flex justify-between items-center lg:hidden">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-xl font-bold">Church Dashboard</h1>
      </div>

      <div className="flex">
        <Button
          variant="outline"
          size="sm"
          className="ml-8 text-white"
          onClick={() => {
            supabase.auth.signOut();
            clearUser();
          }}
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
