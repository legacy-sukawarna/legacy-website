import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConnectGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGroup: any | null;
  newGroup: {
    name: string;
    mentor_id: string;
  };
  setNewGroup: (group: any) => void;
  onSubmit: () => void;
  mentors: User[];
}

export function ConnectGroupDialog({
  open,
  onOpenChange,
  editingGroup,
  mentors,
  newGroup,
  setNewGroup,
  onSubmit,
}: ConnectGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingGroup ? "Edit Group" : "Create New Group"}
          </DialogTitle>
          <DialogDescription>
            {editingGroup
              ? "Make changes to your connect group here."
              : "Add the details for your new connect group here."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Rest of the form content... */}
          {/* Copy the three grid sections from the original file */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <input
              id="name"
              value={newGroup.name}
              onChange={(e) =>
                setNewGroup({ ...newGroup, name: e.target.value })
              }
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mentor" className="text-right">
              Mentor
            </Label>
            <div className="col-span-3">
              <Select
                value={newGroup.mentor_id}
                onValueChange={(value) =>
                  setNewGroup({ ...newGroup, mentor_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors?.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            {editingGroup ? "Save changes" : "Create group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
