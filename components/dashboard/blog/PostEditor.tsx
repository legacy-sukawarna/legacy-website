"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/useBlog";
import { useToast } from "@/components/ui/use-toast";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
} from "lucide-react";

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const PostEditor = ({
  content,
  onChange,
  placeholder = "Start writing your post...",
}: PostEditorProps) => {
  const { toast } = useToast();
  const uploadImage = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "font-bold text-white",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside ml-6 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside ml-6 space-y-1",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "pl-1",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-orange-500 pl-4 italic text-slate-300 my-4",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 my-4 overflow-x-auto",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-slate-700 px-1.5 py-0.5 rounded text-orange-400 text-sm",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-slate-600 my-6",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-slate-200 leading-relaxed my-3",
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-orange-400 underline hover:text-orange-300",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-slate-500 before:absolute before:left-4 before:top-4 before:pointer-events-none",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] focus:outline-none p-4 [&>h1]:text-3xl [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:mt-4 [&>h3]:mb-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const result = await uploadImage.mutateAsync(file);
        if (editor && result.url) {
          editor.chain().focus().setImage({ src: result.url }).run();
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    },
    [editor, uploadImage, toast]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleImageUpload]
  );

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-700 bg-slate-800/80">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("bold")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("italic")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("strike")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("code")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-600 mx-1.5 self-center" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-600 mx-1.5 self-center" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("bulletList")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("orderedList")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-600 mx-1.5 self-center" />

        {/* Block Elements */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("blockquote")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-600 mx-1.5 self-center" />

        {/* Link and Image */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700 ${
            editor.isActive("link")
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : ""
          }`}
          onClick={setLink}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadImage.isPending}
          title="Upload Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />

        <div className="flex-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default PostEditor;
