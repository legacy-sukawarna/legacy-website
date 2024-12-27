"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { UserDialog } from "../../../components/dashboard/users-management/UserDialog";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { UsersTable } from "@/components/dashboard/users-management/UserTable";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { redirect } from "next/navigation";

const roles = ["ADMIN", "MENTOR", "MEMBER"];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserResponse>({
    results: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });
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
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { session } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [groups, setGroups] = useState<any[]>([]);
  const { user } = useAuthStore();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const handleCreateOrUpdate = async () => {
    try {
      if (editingUser) {
        // Update existing user
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser.id}`,
          {
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            gender: newUser.gender,
            group_id: newUser.group_id === "none" ? null : newUser.group_id,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );
      } else {
        // Create new user
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, newUser, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
      }
      // Refresh the users list
      await fetchUsers();
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
      });
    } catch (error) {
      console.error("Error creating/updating user:", error);
      // You might want to add error handling/notification here
    }
  };

  const handleDelete = () => {
    if (userToDelete !== null) {
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
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

  const fetchUsers = async (page = currentPage) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    const data = response.data;
    setUsers(data);
  };

  const fetchGroups = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/connect-groups`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    const data = response.data;
    setGroups(data);
  };

  // Add pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  // Add useEffect to handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1); // Reset to first page when searching
      setCurrentPage(1);
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

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
            {/* <Button
              onClick={() => {
                setEditingUser(null);
                setNewUser({ name: "", email: "", role: "" });
                setIsOpen(true);
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button> */}
          </div>
          <UsersTable
            users={users.results}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={users.pagination.totalPages}
            onPageChange={handlePageChange}
            onEdit={openEditDialog}
            onDelete={openDeleteConfirm}
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
        groups={groups}
      />
    </div>
  );
}
