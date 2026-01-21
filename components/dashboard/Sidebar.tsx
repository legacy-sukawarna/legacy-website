"use client";

import Link from "next/link";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  UserCog,
  Users,
  X,
  LineChart,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const supabase = createClient();
  const { user, clearUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    // First clear the user state
    clearUser();
    // Then sign out from Supabase
    await supabase.auth.signOut();
    // Finally redirect
    router.push("/");
  };

  return (
    <aside
      className={`
        bg-gradient-to-b from-slate-800 to-slate-900 text-slate-300 w-64 p-4 fixed top-[73px] bottom-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        border-r border-slate-700/50
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-xl font-semibold text-white">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          onClick={() => setOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <nav>
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard"
                  ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                  : "hover:bg-slate-700/50 hover:text-white"
              }`}
              onClick={handleLinkClick}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </li>

          {(user?.role === "ADMIN" || user?.role === "MENTOR") && (
            <li>
              <Link
                href="/dashboard/connect-attendance"
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  pathname === "/dashboard/connect-attendance"
                    ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                    : "hover:bg-slate-700/50 hover:text-white"
                }`}
                onClick={handleLinkClick}
              >
                <Users className="mr-3 h-5 w-5" />
                Connect Attendance
              </Link>
            </li>
          )}

          {user?.role === "ADMIN" && (
            <>
              <li>
                <Link
                  href="/dashboard/connect"
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    pathname === "/dashboard/connect"
                      ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                      : "hover:bg-slate-700/50 hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Connect
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/user-management"
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    pathname === "/dashboard/user-management"
                      ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                      : "hover:bg-slate-700/50 hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <UserCog className="mr-3 h-5 w-5" />
                  User Management
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/report"
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    pathname === "/dashboard/report"
                      ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                      : "hover:bg-slate-700/50 hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <LineChart className="mr-3 h-5 w-5" />
                  Report
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/blog/packages"
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    pathname === "/dashboard/blog/packages"
                      ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                      : "hover:bg-slate-700/50 hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <FolderOpen className="mr-3 h-5 w-5" />
                  Blog Packages
                </Link>
              </li>
            </>
          )}

          {(user?.role === "ADMIN" || user?.role === "WRITER") && (
            <li>
              <Link
                href="/dashboard/blog/posts"
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  pathname?.startsWith("/dashboard/blog/posts")
                    ? "bg-orange-500/15 text-orange-400 border-l-2 border-orange-500"
                    : "hover:bg-slate-700/50 hover:text-white"
                }`}
                onClick={handleLinkClick}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Blog Posts
              </Link>
            </li>
          )}

          <li className="pt-4 mt-4 border-t border-slate-700/50">
            <Button
              variant="ghost"
              className="flex justify-start px-3 py-2.5 rounded-lg w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
