"use client";

import { useState, useEffect, Suspense } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { AbsenceList } from "../../../components/dashboard/connect-attendance/AbsenceList";
import ConnectAbsenceForm from "../../../components/dashboard/connect-attendance/ConnectAbsenceForm";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-6">Connect Absence</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Fill Absence Form</TabsTrigger>
          <TabsTrigger value="list">View Absences</TabsTrigger>
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
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectAbsenceContent />
    </Suspense>
  );
}
