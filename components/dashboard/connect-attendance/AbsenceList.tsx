"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AbsenceList() {
  const { user, session } = useAuthStore();
  const [absences, setAbsences] = useState<AbsenceResponse>({
    records: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchAbsences = async (page: number = 1) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/connect-attendance`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          params: {
            page,
            limit,
            group_id: user?.group_id,
            sort_by: "created_at",
            sort_order: "desc",
          },
        }
      );
      setAbsences(response.data);
    } catch (error) {
      console.error("Error fetching absences:", error);
    }
  };

  useEffect(() => {
    fetchAbsences(currentPage);
  }, [currentPage, limit]);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white">Attendance History</h2>
        <p className="text-slate-400 text-sm mt-1">View your connect group attendance records</p>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50 hover:bg-transparent">
                  <TableHead className="text-slate-300 bg-slate-700/30">Group</TableHead>
                  <TableHead className="text-slate-300 bg-slate-700/30">Date</TableHead>
                  <TableHead className="text-slate-300 bg-slate-700/30">Photo</TableHead>
                  <TableHead className="text-slate-300 bg-slate-700/30">Notes</TableHead>
                  <TableHead className="text-slate-300 bg-slate-700/30">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absences.records?.length === 0 ? (
                  <TableRow className="border-slate-700/50">
                    <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  absences.records?.map((absence: Absence) => (
                    <TableRow key={absence.id} className="border-slate-700/50 hover:bg-slate-700/20">
                      <TableCell className="text-slate-300">{absence.group.name}</TableCell>
                      <TableCell className="text-slate-300">{format(absence.date, "PPP")}</TableCell>
                      <TableCell>
                        {absence.photo_url ? (
                          <a
                            href={absence.photo_url}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                            target="_blank"
                          >
                            View Photo
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300">{absence.notes || <span className="text-slate-500">-</span>}</TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {format(absence.created_at, "PPP hh:mm a")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Showing {absences.records.length} of {absences.pagination.total} results
              </div>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px] bg-slate-700/50 border-slate-600 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= absences.pagination.totalPages}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
