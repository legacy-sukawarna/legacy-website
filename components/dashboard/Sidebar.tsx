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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
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
    clearUser();
    router.push("/");
    await supabase.auth.signOut();
  };

  return (
    <aside
      className={`
        bg-gray-800 text-white w-64 min-h-screen p-4 fixed inset-y-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-2xl font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <nav>
        <ul>
          <li className="mb-2">
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                pathname === "/dashboard" ? "bg-gray-700 font-medium" : ""
              }`}
              onClick={handleLinkClick}
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Link>
          </li>
          {user?.role === "ADMIN" && (
            <li className="mb-2">
              <Link
                href="/dashboard/connect"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  pathname === "/dashboard/connect"
                    ? "bg-gray-700 font-medium"
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <FileText className="mr-2" />
                Connect
              </Link>
            </li>
          )}

          {(user?.role === "ADMIN" || user?.role === "MENTOR") && (
            <li className="mb-2">
              <Link
                href="/dashboard/connect-attendance"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  pathname === "/dashboard/connect-attendance"
                    ? "bg-gray-700 font-medium"
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <Users className="mr-2" />
                Connect Attendance
              </Link>
            </li>
          )}

          {user?.role === "ADMIN" && (
            <li className="mb-2">
              <Link
                href="/dashboard/user-management"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  pathname === "/dashboard/user-management"
                    ? "bg-gray-700 font-medium"
                    : ""
                }`}
              >
                <UserCog className="mr-2" />
                User Management
              </Link>
            </li>
          )}

          {/* <li className="mb-2">
            <Link
              href="/dashboard/event-attendance"
              className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                pathname === "/dashboard/event-attendance"
                  ? "bg-gray-700 font-medium"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              <Calendar className="mr-2" />
              Event Attendance
            </Link>
          </li> */}
          <li className="mb-2">
            <Button
              variant={"ghost"}
              className="flex justify-start p-2 rounded hover:bg-gray-700 w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" />
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
