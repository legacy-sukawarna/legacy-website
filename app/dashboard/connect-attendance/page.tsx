"use client";

import { useState, useEffect, Suspense } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { AbsenceList } from "../../../components/dashboard/connect-attendance/AbsenceList";
import ConnectAbsenceForm from "../../../components/dashboard/connect-attendance/ConnectAbsenceForm";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ClipboardList } from "lucide-react";

const ConnectAbsenceContent = () => {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "form");

  // Update active tab when query param changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "form" || tab === "list") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!user || (user.role !== "MENTOR" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-orange-400" />
          Connect Attendance
        </h1>
        <p className="text-slate-400 mt-1">
          Submit and track your connect group attendance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50 p-1 rounded-lg">
          <TabsTrigger
            value="form"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50 rounded-md transition-all duration-200"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Fill Attendance Form
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50 rounded-md transition-all duration-200"
          >
            <Users className="w-4 h-4 mr-2" />
            View Attendance History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="mt-6">
          <ConnectAbsenceForm />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <AbsenceList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function ConnectAbsencePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ConnectAbsenceContent />
    </Suspense>
  );
}
