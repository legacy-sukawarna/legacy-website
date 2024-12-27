import { ConnectGroupManager } from "@/components/dashboard/connect/ConnectGroupManager";
import { MentorAbsenceList } from "@/components/dashboard/connect/MentorAbsenceList";

export default async function ConnectReportPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Connect Dashboard</h1>
      <div className="flex flex-col gap-4">
        <MentorAbsenceList />
        <ConnectGroupManager />
      </div>
    </div>
  );
}
