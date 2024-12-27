"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { ConnectGroupDialog } from "./ConnectGroupDialog";
import { toast } from "@/components/ui/use-toast";

export function ConnectGroupManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [newGroup, setNewGroup] = useState({
    name: "",
    mentor_id: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const { session } = useAuthStore();
  const [mentors, setMentors] = useState<User[]>([]);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingGroup) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/connect-groups/${editingGroup.id}`,
          {
            name: newGroup.name,
            mentor_id: newGroup.mentor_id,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );
        toast({
          title: "Success",
          description: "Group updated successfully",
        });
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/connect-groups`,
          {
            name: newGroup.name,
            mentor_id: newGroup.mentor_id,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );
        toast({
          title: "Success",
          description: "Group created successfully",
        });
      }

      setIsOpen(false);
      setEditingGroup(null);
      setNewGroup({ name: "", mentor_id: "" });
      fetchGroups();
    } catch (error: any) {
      console.error("Error creating or updating group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.messages[0],
      });
    }
  };

  const handleDelete = async () => {
    if (groupToDelete !== null) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/connect-groups/${groupToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        toast({
          title: "Success",
          description: "Group deleted successfully",
        });

        await fetchGroups(); // Refresh the groups list
        setDeleteConfirmOpen(false);
        setGroupToDelete(null);
      } catch (error: any) {
        console.error("Error deleting group:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.messages?.[0] || "Failed to delete group",
        });
      }
    }
  };

  const openEditDialog = (group: any) => {
    setEditingGroup(group);
    setNewGroup({ ...group, mentees: group.mentees || [] });
    setIsOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setGroupToDelete(id);
    setDeleteConfirmOpen(true);
  };

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

  const fetchMentors = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        params: {
          role: "MENTOR",
          limit: 1000,
        },
      }
    );
    setMentors(response.data.results);
  };

  useEffect(() => {
    fetchGroups();
    fetchMentors();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Groups</CardTitle>
        <CardDescription>Manage your connect groups here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            onClick={() => {
              setEditingGroup(null);
              setNewGroup({ name: "", mentor_id: "" });
              setIsOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Group
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Total Mentees</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.mentor.name}</TableCell>
                <TableCell>{group.mentees.length}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(group)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteConfirm(group.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the connect group and remove its data from our servers."
        confirmText="Delete"
      />
      <ConnectGroupDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        editingGroup={editingGroup}
        mentors={mentors}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        onSubmit={handleCreateOrUpdate}
      />
    </Card>
  );
}
