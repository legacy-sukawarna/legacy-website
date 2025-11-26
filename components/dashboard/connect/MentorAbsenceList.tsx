"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth } from "date-fns";
import { CalendarIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import ConnectReportButton from "./ConnectReportButton";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { DeleteAbsenceDialog } from "./DeleteAbsenceDialog";
import { EditAbsenceDialog } from "./EditAbsenceDialog";

export function MentorAbsenceList() {
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [groups, setGroups] = useState<GroupResponse>({
    records: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const columns: ColumnDef<Absence>[] = [
    {
      accessorKey: "group.name",
      header: "Group Name",
      cell: ({ row }) => row.original.group.name || "-",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.date), "PPP"),
    },
    {
      accessorKey: "photo_url",
      header: "Photo URL",
      cell: ({ row }) =>
        row.original.photo_url ? (
          <a
            href={row.original.photo_url}
            className="text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Photo
          </a>
        ) : (
          "-"
        ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => row.original.notes || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const absence = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem onClick={() => handleEdit(absence)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => handleDelete(absence.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: absences.records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: 10,
      },
    },
    pageCount: absences.pagination.totalPages,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPageIndex =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize: 10 }).pageIndex
          : updater.pageIndex;
      setCurrentPage(newPageIndex + 1);
    },
  });

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/connect-groups`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchAbsences = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/connect-attendance`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          params: {
            page,
            limit: 10,
            start_date: dateRange?.from?.toISOString(),
            end_date: dateRange?.to?.toISOString(),
            group_id: selectedGroupId === "all" ? undefined : selectedGroupId,
          },
        }
      );
      setAbsences(response.data);
    } catch (error) {
      console.error("Error fetching mentor absences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchAbsences(currentPage);
  }, [currentPage, dateRange, selectedGroupId]);

  const handleEdit = (absence: Absence) => {
    setEditingAbsence(absence);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAbsenceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (absenceToDelete === null) return;

    setIsLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/connect-attendance/${absenceToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Absence record deleted successfully",
      });

      // Refresh the data
      fetchAbsences(currentPage);
    } catch (error) {
      console.error("Error deleting absence:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete absence record",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setAbsenceToDelete(null);
    }
  };

  const handleEditSubmit = async (updatedAbsence: Partial<Absence>) => {
    if (!editingAbsence) return;

    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/connect-attendance/${editingAbsence.id}`,
        {
          date: updatedAbsence.date,
          notes: updatedAbsence.notes,
          photo_url: updatedAbsence.photo_url,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Absence record updated successfully",
      });

      // Refresh the data
      fetchAbsences(currentPage);
    } catch (error) {
      console.error("Error updating absence:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update absence record",
      });
    } finally {
      setIsLoading(false);
      setIsEditDialogOpen(false);
      setEditingAbsence(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Absences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.records.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
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
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <ConnectReportButton
              startDate={dateRange?.from?.toISOString()}
              endDate={dateRange?.to?.toISOString()}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing page {absences.pagination.page} of{" "}
              {absences.pagination.totalPages}
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

      <DeleteAbsenceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <EditAbsenceDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditSubmit}
        absence={editingAbsence as Absence | null}
      />
    </Card>
  );
}
