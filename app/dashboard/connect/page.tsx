import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MentorAbsenceList } from "@/components/dashboard/connect-report/MentorAbsenceList";
import ConnectReportButton from "../../../components/dashboard/connect-report/ConnectReportButton";

export default async function ConnectReportPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Connect</h1>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>
              Download a CSV report of all mentor absences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectReportButton />
          </CardContent>
        </Card>

        <MentorAbsenceList />
      </div>
    </div>
  );
}
