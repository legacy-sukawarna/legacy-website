"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGroups } from "@/hooks/useGroup";
import { useCreateConnectAttendance } from "@/hooks/useConnectAttendance";

const formSchema = z.object({
  group_id: z.string({
    required_error: "A group is required.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  notes: z.string().optional(),
  file: z.any().optional(),
});

export default function ConnectAbsenceForm() {
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  // Fetch groups using React Query hook
  const { data: groups, isLoading: isLoadingGroups } = useGroups();

  // Mutation for creating attendance
  const createAttendanceMutation = useCreateConnectAttendance();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
      group_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("group_id", values.group_id || "");
    formData.append("date", values.date.toISOString());
    if (values.notes) formData.append("notes", values.notes);
    if (values.file && values.file.length > 0) {
      Array.from(values.file).forEach((file) => {
        formData.append("photo_file", file as Blob);
      });
    }

    try {
      await createAttendanceMutation.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Attendance submitted successfully",
      });
      form.reset();
    } catch (error: any) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.messages?.[0] ||
            "Failed to submit attendance",
        });
      }
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white">Submit Attendance</h2>
        <p className="text-slate-400 text-sm mt-1">
          Fill out the form to record your connect group attendance
        </p>
      </div>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-[280px]">
                  <FormLabel className="text-slate-300">Group</FormLabel>
                  <Popover
                    open={groupPopoverOpen}
                    onOpenChange={setGroupPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={groupPopoverOpen}
                        className="col-span-3 justify-between bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white"
                        disabled={isLoadingGroups}
                      >
                        {isLoadingGroups
                          ? "Loading groups..."
                          : field.value && groups?.records
                          ? groups.records.find(
                              (group) => group.id === field.value
                            )?.name
                          : "Select Group..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0 bg-slate-800 border-slate-700">
                      <Command className="bg-slate-800">
                        <CommandInput
                          placeholder="Search Group..."
                          className="text-slate-200"
                        />
                        <CommandList>
                          <CommandEmpty className="text-slate-400 py-6 text-center text-sm">
                            No Group found.
                          </CommandEmpty>
                          <CommandGroup>
                            {groups?.records
                              ?.slice()
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((group) => (
                              <CommandItem
                                key={group.id}
                                value={group.name}
                                onSelect={() => {
                                  field.onChange(group.id);
                                  setGroupPopoverOpen(false);
                                }}
                                className="text-slate-300 hover:bg-slate-700 hover:text-white"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 text-orange-400",
                                    field.value === group.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {group.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-slate-300">Date</FormLabel>
                  <Popover
                    open={datePopoverOpen}
                    onOpenChange={setDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] pl-3 text-left font-normal bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:text-white",
                            !field.value ? "text-slate-400" : "text-slate-200"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-orange-400" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-slate-800 border-slate-700"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // Set the time to noon (12:00) of the selected date to avoid timezone issues
                            const adjustedDate = new Date(date);
                            adjustedDate.setHours(12, 0, 0, 0);
                            field.onChange(adjustedDate);
                            setDatePopoverOpen(false);
                          } else {
                            field.onChange(date);
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-slate-500">
                    The date of your connect group meeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Notes (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes here..."
                      className="resize-none bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    You can provide any additional information about the
                    meeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Upload Photos (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onChange(e.target.files)}
                      className="bg-slate-700/50 border-slate-600 text-slate-200 file:bg-slate-600 file:text-slate-200 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md hover:file:bg-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    You can upload photos from the connect group meeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={createAttendanceMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {createAttendanceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Attendance
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
