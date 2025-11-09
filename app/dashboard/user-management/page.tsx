"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { UserDialog } from "../../../components/dashboard/users-management/UserDialog";
import { useAuthStore } from "@/store/authStore";
import { UsersTable } from "@/components/dashboard/users-management/UserTable";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { redirect } from "next/navigation";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/useUser";
import { useGroups } from "@/hooks/useGroup";
import { toast } from "@/components/ui/use-toast";

const roles = ["ADMIN", "MENTOR", "MEMBER"];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    gender: "",
    group_id: "",
    birth_date: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { user } = useAuthStore();

  // Queries
  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const { data: groupsData } = useGroups();

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const handleCreateOrUpdate = async () => {
    try {
      if (editingUser) {
        // Update existing user
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as Role | undefined,
          phone: newUser.phone,
          gender: newUser.gender as Gender | undefined,
          group_id: newUser.group_id === "none" ? undefined : newUser.group_id,
        });
      } else {
        // Create new user
        await createUserMutation.mutateAsync({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as Role | undefined,
          phone: newUser.phone,
          gender: newUser.gender as Gender | undefined,
          group_id: newUser.group_id === "none" ? undefined : newUser.group_id,
        });
      }

      // Reset form and close dialog
      setIsOpen(false);
      setEditingUser(null);
      setNewUser({
        name: "",
        email: "",
        role: "",
        phone: "",
        gender: "",
        group_id: "",
        birth_date: "",
      });

      toast({
        title: "Success",
        description: "User created/updated successfully",
      });
    } catch (error) {
      console.error("Error creating/updating user:", error);
      toast({
        title: "Error",
        description: "Error creating/updating user",
      });
    }
  };

  const handleDelete = async () => {
    if (userToDelete !== null) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete);
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setNewUser(user);
    setIsOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Add pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Add useEffect to handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <UsersTable
            users={usersData?.results || []}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={usersData?.pagination.totalPages || 0}
            onPageChange={handlePageChange}
            onEdit={openEditDialog}
            onDelete={openDeleteConfirm}
            isLoading={usersLoading}
          />
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the user and remove their data from our servers."
        confirmText="Delete"
      />
      <UserDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        editingUser={editingUser}
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleCreateOrUpdate}
        roles={roles}
        setEditingUser={setEditingUser}
        groups={groupsData}
      />
    </div>
  );
}
