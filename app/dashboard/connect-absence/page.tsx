"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AbsenceList } from "../../../components/dashboard/connect-absence/AbsenceList";
import ConnectAbsenceForm from "../../../components/dashboard/connect-absence/ConnectAbsenceForm";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConnectAbsencePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("form");

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
}
