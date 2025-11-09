import Link from "next/link";
import { BookOpen, Calendar, CheckCircle, UserCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Legacy Dashboard
      </h1>
      <p className="mb-4">
        This is where you can view and manage your church activities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg shadow bg-card col-span-1">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="https://drive.google.com/drive/folders/1R5tbR7AJeNzDixeHDZ7pEfhVTCFSt3ny?usp=sharing"
                target="_blank"
                className="flex items-center p-3 transition-colors rounded-md hover:bg-blue-50 group"
              >
                <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                <span className=" group-hover:text-blue-600">Tutorials</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/connect-attendance?tab=list"
                className="flex items-center p-3 transition-colors rounded-md hover:bg-blue-50 group"
              >
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                <span className=" group-hover:text-blue-600">
                  Check your attendance
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/connect-attendance?tab=form"
                className="flex items-center p-3 transition-colors rounded-md hover:bg-blue-50 group"
              >
                <UserCheck className="w-5 h-5 text-blue-500 mr-3" />
                <span className=" group-hover:text-blue-600">
                  Submit connect attendance
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
