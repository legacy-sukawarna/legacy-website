"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
// import { generateReport } from "@/app/actions/generateReport";

export default function ConnectReportButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuthStore();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  const generateReport = () => {
    /* Implement this function */
    return;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "connect-absence-report.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleGenerateReport} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </>
      )}
    </Button>
  );
}
