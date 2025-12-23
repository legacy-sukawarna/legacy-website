import { ConnectGroupManager } from "@/components/dashboard/connect/ConnectGroupManager";
import { MentorAbsenceList } from "@/components/dashboard/connect/MentorAbsenceList";
import { Users } from "lucide-react";

export default async function ConnectReportPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-orange-400" />
          Connect Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Manage connect groups and track mentor attendance
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <MentorAbsenceList />
        <ConnectGroupManager />
      </div>
    </div>
  );
}
