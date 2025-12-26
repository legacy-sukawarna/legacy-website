"use client";

import { useState } from "react";
import {
  usePackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
} from "@/hooks/useBlog";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";

export default function PackagesPage() {
  const { user } = useAuthStore();
  const { data: packages, isLoading } = usePackages();
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  // Only ADMIN can access this page
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to manage packages.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setFormData({ name: "", description: "", slug: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      slug: pkg.slug,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (pkg: Package) => {
    setDeletingPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPackage) {
        await updatePackage.mutateAsync({
          id: editingPackage.id,
          ...formData,
        });
        toast({
          title: "Package updated",
          description: "The package has been updated successfully.",
        });
      } else {
        await createPackage.mutateAsync(formData);
        toast({
          title: "Package created",
          description: "The package has been created successfully.",
        });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingPackage) return;

    try {
      await deletePackage.mutateAsync(deletingPackage.id);
      toast({
        title: "Package deleted",
        description: "The package has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Packages</h1>
          <p className="text-slate-400">
            Manage blog packages (themes/categories)
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Package
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-slate-700" />
                <Skeleton className="h-4 w-1/2 bg-slate-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full bg-slate-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : packages?.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No packages yet
            </h3>
            <p className="text-slate-400 mb-4">
              Create your first package to organize your posts
            </p>
            <Button
              onClick={handleOpenCreate}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages?.map((pkg) => (
            <Card
              key={pkg.id}
              className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-white">{pkg.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      /{pkg.slug}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => handleOpenEdit(pkg)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-400"
                      onClick={() => handleOpenDelete(pkg)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm line-clamp-2">
                  {pkg.description || "No description"}
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  {pkg._count?.posts || 0} posts
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Create Package"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingPackage
                ? "Update the package details."
                : "Create a new package to organize your posts."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Package name"
                className="bg-slate-900 border-slate-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="url-friendly-slug (auto-generated if empty)"
                className="bg-slate-900 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this package"
                className="bg-slate-900 border-slate-600"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={createPackage.isPending || updatePackage.isPending}
              >
                {editingPackage ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete &quot;{deletingPackage?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePackage.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
