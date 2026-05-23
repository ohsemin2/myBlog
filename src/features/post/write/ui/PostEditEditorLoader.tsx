"use client";

import dynamic from "next/dynamic";
import type { Category } from "@/entities/category";

const PostEditEditor = dynamic(() => import("./PostEditEditor"), { ssr: false });

interface PostEditEditorLoaderProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialCategoryId: number | null;
  initialCategories: Category[];
  isDraft: boolean;
}

export default function PostEditEditorLoader({
  id,
  initialTitle,
  initialContent,
  initialCategoryId,
  initialCategories,
  isDraft,
}: PostEditEditorLoaderProps) {
  return (
    <PostEditEditor
      id={id}
      initialTitle={initialTitle}
      initialContent={initialContent}
      initialCategoryId={initialCategoryId}
      initialCategories={initialCategories}
      isDraft={isDraft}
    />
  );
}
