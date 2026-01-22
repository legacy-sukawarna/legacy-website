"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  usePost,
  usePackages,
  useCreatePost,
  useUpdatePost,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { FeaturedImageUpload } from "@/components/dashboard/blog/FeaturedImageUpload";

// Dynamically import the editor to avoid SSR issues
const PostEditor = dynamic(
  () => import("@/components/dashboard/blog/PostEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="border border-slate-700 rounded-lg p-4 min-h-[400px] bg-slate-900">
        <Skeleton className="h-8 w-full bg-slate-700 mb-4" />
        <Skeleton className="h-4 w-3/4 bg-slate-700 mb-2" />
        <Skeleton className="h-4 w-1/2 bg-slate-700" />
      </div>
    ),
  }
);

export default function PostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const isNew = params.id === "new";
  const postId = isNew ? undefined : (params.id as string);

  const { data: existingPost, isLoading: postLoading } = usePost(postId || "");
  const { data: packages } = usePackages();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const publishPost = usePublishPost();
  const unpublishPost = useUnpublishPost();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    package_id: "",
  });

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        slug: existingPost.slug,
        content: existingPost.content,
        excerpt: existingPost.excerpt || "",
        featured_image: existingPost.featured_image || "",
        package_id: existingPost.package_id,
      });
    }
  }, [existingPost]);

  // Only ADMIN and WRITER can access this page
  if (user?.role !== "ADMIN" && user?.role !== "WRITER") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to create or edit posts.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.package_id) {
      toast({
        title: "Validation Error",
        description: "Please select a package",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isNew) {
        const newPost = await createPost.mutateAsync({
          title: formData.title,
          slug: formData.slug || undefined,
          content: formData.content,
          excerpt: formData.excerpt || undefined,
          featured_image: formData.featured_image || undefined,
          package_id: formData.package_id,
        });

        if (publish) {
          await publishPost.mutateAsync(newPost.id);
        }

        toast({
          title: publish ? "Post published" : "Post created",
          description: publish
            ? "Your post is now live."
            : "Your post has been saved as a draft.",
        });

        router.push("/dashboard/blog/posts");
      } else {
        await updatePost.mutateAsync({
          id: postId!,
          title: formData.title,
          slug: formData.slug || undefined,
          content: formData.content,
          excerpt: formData.excerpt || undefined,
          featured_image: formData.featured_image || undefined,
          package_id: formData.package_id,
        });

        if (publish && existingPost?.status === "DRAFT") {
          await publishPost.mutateAsync(postId!);
        }

        toast({
          title: "Post updated",
          description: "Your changes have been saved.",
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

  const handleTogglePublish = async () => {
    if (!existingPost) return;

    try {
      if (existingPost.status === "PUBLISHED") {
        await unpublishPost.mutateAsync(existingPost.id);
        toast({
          title: "Post unpublished",
          description: "The post has been unpublished.",
        });
      } else {
        await publishPost.mutateAsync(existingPost.id);
        toast({
          title: "Post published",
          description: "Your post is now live.",
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

  if (!isNew && postLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-700" />
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full bg-slate-700" />
            <Skeleton className="h-10 w-full bg-slate-700" />
            <Skeleton className="h-[400px] w-full bg-slate-700" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSaving =
    createPost.isPending ||
    updatePost.isPending ||
    publishPost.isPending ||
    unpublishPost.isPending;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blog/posts">
            <Button variant="ghost" size="icon" className="text-slate-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? "Create Post" : "Edit Post"}
            </h1>
            {existingPost && (
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    existingPost.status === "PUBLISHED"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    existingPost.status === "PUBLISHED"
                      ? "bg-green-600"
                      : "bg-slate-600"
                  }
                >
                  {existingPost.status}
                </Badge>
                <span className="text-slate-400 text-sm">
                  Last updated:{" "}
                  {new Date(existingPost.updated_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && existingPost && (
            <Button
              variant="outline"
              onClick={handleTogglePublish}
              disabled={isSaving}
              className="border-slate-600"
            >
              {existingPost.status === "PUBLISHED" ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
          <Button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            variant="outline"
            className="border-slate-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          {(isNew || existingPost?.status === "DRAFT") && (
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isNew ? "Publish" : "Save & Publish"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter post title"
              className="bg-slate-900 border-slate-600 text-lg"
            />
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <Label className="text-white">Content</Label>
            <PostEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Post Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Package */}
              <div className="space-y-2">
                <Label className="text-white">Package</Label>
                <Select
                  value={formData.package_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, package_id: value })
                  }
                >
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {packages?.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-white">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-friendly-slug"
                  className="bg-slate-900 border-slate-600"
                />
                <p className="text-xs text-slate-400">
                  Leave empty to auto-generate from title
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-white">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief description for previews"
                  className="bg-slate-900 border-slate-600"
                  rows={3}
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label className="text-white">Featured Image</Label>
                <FeaturedImageUpload
                  value={formData.featured_image}
                  onChange={(url) =>
                    setFormData({ ...formData, featured_image: url })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
