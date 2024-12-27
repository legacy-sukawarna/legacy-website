"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import axios from "axios";

interface ConnectReportButtonProps {
  startDate?: string;
  endDate?: string;
}

export default function ConnectReportButton({
  startDate,
  endDate,
}: ConnectReportButtonProps) {
  const { user, session } = useAuthStore();

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/connect-attendance/report/generate`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate,
            group_id: user?.group_id,
            format: "sheet",
          },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "connect-absence-report.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={!startDate || !endDate}>
      Download Report
    </Button>
  );
}
