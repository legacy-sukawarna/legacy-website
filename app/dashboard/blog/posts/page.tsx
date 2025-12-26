"use client";

import { useState } from "react";
import Link from "next/link";
import {
  usePostsAdmin,
  usePackages,
  useDeletePost,
  usePublishPost,
  useUnpublishPost,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  Search,
  Filter,
} from "lucide-react";

export default function PostsPage() {
  const { user } = useAuthStore();
  const { data: packages } = usePackages();
  const { toast } = useToast();
  const deletePost = useDeletePost();
  const publishPost = usePublishPost();
  const unpublishPost = useUnpublishPost();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  const { data: postsData, isLoading } = usePostsAdmin({
    search: search || undefined,
    status: statusFilter !== "all" ? (statusFilter as PostStatus) : undefined,
    package_id: packageFilter !== "all" ? packageFilter : undefined,
    page,
    limit: 10,
  });

  // Only ADMIN and WRITER can access this page
  if (user?.role !== "ADMIN" && user?.role !== "WRITER") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to manage posts.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleOpenDelete = (post: Post) => {
    setDeletingPost(post);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingPost) return;

    try {
      await deletePost.mutateAsync(deletingPost.id);
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
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

  const handleTogglePublish = async (post: Post) => {
    try {
      if (post.status === "PUBLISHED") {
        await unpublishPost.mutateAsync(post.id);
        toast({
          title: "Post unpublished",
          description: "The post has been unpublished.",
        });
      } else {
        await publishPost.mutateAsync(post.id);
        toast({
          title: "Post published",
          description: "The post is now live.",
        });
      }
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
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-slate-400">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/blog/posts/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-slate-900 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-slate-600">
                <SelectValue placeholder="Package" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Packages</SelectItem>
                {packages?.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4 bg-slate-700" />
                    <Skeleton className="h-4 w-1/2 bg-slate-700" />
                  </div>
                  <Skeleton className="h-8 w-20 bg-slate-700" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : postsData?.results.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No posts yet
            </h3>
            <p className="text-slate-400 mb-4">
              Create your first post to get started
            </p>
            <Link href="/dashboard/blog/posts/new">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {postsData?.results.map((post) => (
            <Card
              key={post.id}
              className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {post.title}
                      </h3>
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "default" : "secondary"
                        }
                        className={
                          post.status === "PUBLISHED"
                            ? "bg-green-600"
                            : "bg-slate-600"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Package: {post.package?.name || "Unknown"}</span>
                      <span>Author: {post.author?.name || "Unknown"}</span>
                      <span>
                        Created:{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      {post.published_at && (
                        <span>
                          Published:{" "}
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-slate-300 text-sm mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => handleTogglePublish(post)}
                      disabled={
                        publishPost.isPending || unpublishPost.isPending
                      }
                    >
                      {post.status === "PUBLISHED" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Link href={`/dashboard/blog/posts/${post.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-400"
                      onClick={() => handleOpenDelete(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {postsData && postsData.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-slate-600"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-slate-400">
                Page {page} of {postsData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= postsData.pagination.totalPages}
                className="border-slate-600"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete &quot;{deletingPost?.title}&quot;?
              This action cannot be undone.
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
              disabled={deletePost.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
