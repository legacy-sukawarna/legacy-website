import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EditAbsenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAbsence: Partial<Absence>) => void;
  absence: Absence | null;
}

export function EditAbsenceDialog({
  isOpen,
  onClose,
  onSave,
  absence,
}: EditAbsenceDialogProps) {
  const [editedAbsence, setEditedAbsence] = useState<Partial<Absence> | null>(
    null
  );
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (absence) {
      setEditedAbsence({
        ...absence,
        date: new Date(absence.date),
      });
    }
  }, [absence]);

  if (!absence || !editedAbsence) return null;

  const handleSave = () => {
    if (editedAbsence) {
      onSave(editedAbsence);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Absence</DialogTitle>
          <DialogDescription>
            Make changes to the absence record here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedAbsence.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedAbsence.date ? (
                      format(new Date(editedAbsence.date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      editedAbsence.date
                        ? new Date(editedAbsence.date)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const adjustedDate = new Date(date);
                        adjustedDate.setHours(12, 0, 0, 0);
                        setEditedAbsence({
                          ...editedAbsence,
                          date: adjustedDate,
                        });
                        setDatePopoverOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={editedAbsence.notes}
              onChange={(e) => {
                setEditedAbsence({
                  ...editedAbsence,
                  notes: e.target.value,
                });
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {/* <Button onClick={handleSave}>Save Changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
