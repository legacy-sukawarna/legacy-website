"use client";

import { useEffect, useState } from "react";
import { addDays, format, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
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
            start_date: date?.from?.toISOString(),
            end_date: date?.to?.toISOString(),
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
  }, [currentPage, date, limit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Absence History List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Photo Url</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absences.records?.map((absence: Absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.group.name}</TableCell>
                  <TableCell>{format(absence.date, "PPP")}</TableCell>
                  <TableCell>
                    {absence.photo_url ? (
                      <a
                        href={absence.photo_url}
                        className="text-blue-500"
                        target="_blank"
                      >
                        View Photo
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{absence.notes || "-"}</TableCell>
                  <TableCell>
                    {format(absence.created_at, "PPP hh:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {absences.records.length} of {absences.pagination.total}{" "}
                results
              </div>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= absences.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
