import Link from "next/link";
import { Calendar, LayoutDashboard, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
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
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/dashboard/connect-absence"
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <Users className="mr-2" />
              Connect Absence
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/dashboard/event-attendance"
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <Calendar className="mr-2" />
              Event Attendance
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
