"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  UserCheck,
  Users,
  FileText,
  ExternalLink,
  Database,
  CalendarDays,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const canAccessConnectAttendance =
    user?.role === "ADMIN" || user?.role === "MENTOR";
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s what you can do today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resources Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 text-orange-400 mr-2" />
            Resources
          </h2>

          <ul className="space-y-2">
            {/* Service Scheduling - Available to all */}
            <li>
              <Link
                href="https://ciss-user.carrd.co/"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 text-slate-500 group-hover:text-orange-400 mr-3" />
                  <span className="text-slate-300 group-hover:text-orange-400">
                    Service Scheduling
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-orange-400" />
              </Link>
            </li>

            {/* Admin only resources */}
            {isAdmin && (
              <>
                <li>
                  <Link
                    href="https://drive.google.com/drive/folders/1R5tbR7AJeNzDixeHDZ7pEfhVTCFSt3ny?usp=sharing"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
                  >
                    <span className="text-slate-300 group-hover:text-orange-400">
                      Tutorials & Guides
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-orange-400" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://docs.google.com/spreadsheets/d/12JE9T6tMkiFdoD05z0gV2H0zlPcGi1qfLaTYGtgHfiY/edit?gid=666619809#gid=666619809"
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <Database className="w-5 h-5 text-slate-500 group-hover:text-orange-400 mr-3" />
                      <span className="text-slate-300 group-hover:text-orange-400">
                        Legacy Data Center
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-orange-400" />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Connect Attendance - ADMIN & MENTOR only */}
        {canAccessConnectAttendance && (
          <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 text-orange-400 mr-2" />
              Connect Attendance
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/connect-attendance?tab=list"
                  className="flex items-center p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
                >
                  <CheckCircle className="w-5 h-5 text-slate-500 group-hover:text-orange-400 mr-3" />
                  <span className="text-slate-300 group-hover:text-orange-400">
                    View attendance records
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/connect-attendance?tab=form"
                  className="flex items-center p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
                >
                  <UserCheck className="w-5 h-5 text-slate-500 group-hover:text-orange-400 mr-3" />
                  <span className="text-slate-300 group-hover:text-orange-400">
                    Submit new attendance
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Admin Quick Actions - ADMIN only */}
        {isAdmin && (
          <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 text-orange-400 mr-2" />
              Admin Actions
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/connect"
                  className="flex items-center p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
                >
                  <Users className="w-5 h-5 text-slate-500 group-hover:text-orange-400 mr-3" />
                  <span className="text-slate-300 group-hover:text-orange-400">
                    Manage Connect Groups
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/user-management"
                  className="flex items-center p-3 rounded-lg bg-slate-700/30 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all duration-200 group"
                >
                  <UserCheck className="w-5 h-5 text-slate-500 group-hover:text-orange-400 mr-3" />
                  <span className="text-slate-300 group-hover:text-orange-400">
                    Manage Users
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
