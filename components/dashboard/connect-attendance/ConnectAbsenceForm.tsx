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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-[240px]">
                  <FormLabel htmlFor="group">Group</FormLabel>
                  <Popover
                    open={groupPopoverOpen}
                    onOpenChange={setGroupPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={groupPopoverOpen}
                        className="col-span-3 justify-between"
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
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Group..." />
                        <CommandList>
                          <CommandEmpty>No Group found.</CommandEmpty>
                          <CommandGroup>
                            {groups?.records?.map((group) => (
                              <CommandItem
                                key={group.id}
                                value={group.name}
                                onSelect={() => {
                                  field.onChange(group.id);
                                  setGroupPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
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
                  <FormLabel>Date</FormLabel>
                  <Popover
                    open={datePopoverOpen}
                    onOpenChange={setDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
                  <FormDescription>The date of your absence.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes here..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can provide any additional information about your
                    absence.
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
                  <FormLabel>Upload Photos (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can upload photos related to your absence if needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createAttendanceMutation.isPending}>
              {createAttendanceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
