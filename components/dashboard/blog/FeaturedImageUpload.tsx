"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/useBlog";
import { useToast } from "@/components/ui/use-toast";

interface FeaturedImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export const FeaturedImageUpload = ({
  value,
  onChange,
}: FeaturedImageUploadProps) => {
  const { toast } = useToast();
  const uploadImage = useUploadImage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      try {
        const result = await uploadImage.mutateAsync(file);
        if (result.url) {
          onChange(result.url);
          toast({
            title: "Image uploaded",
            description: "Featured image has been uploaded successfully.",
          });
        }
      } catch (error) {
        // Revert preview on error
        setPreviewUrl(null);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    },
    [uploadImage, onChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: uploadImage.isPending,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setPreviewUrl(null);
  };

  const displayUrl = value || previewUrl;

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${isDragActive ? "border-orange-500 bg-orange-500/10" : "border-slate-600 hover:border-slate-500"}
          ${uploadImage.isPending ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        {displayUrl ? (
          <div className="relative">
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image
                src={displayUrl}
                alt="Featured image preview"
                fill
                className="object-cover"
                onError={() => {
                  setPreviewUrl(null);
                }}
              />
            </div>
            {uploadImage.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            )}
            {!uploadImage.isPending && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            {uploadImage.isPending ? (
              <>
                <Loader2 className="h-10 w-10 text-slate-400 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-slate-700/50 rounded-full mb-3">
                  {isDragActive ? (
                    <Upload className="h-6 w-6 text-orange-500" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <p className="text-sm text-slate-300 text-center">
                  {isDragActive ? (
                    "Drop the image here"
                  ) : (
                    <>
                      <span className="text-orange-400 font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, GIF, WebP (max 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedImageUpload;
