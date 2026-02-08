"use client";

import dynamic from "next/dynamic";

const PostEditEditor = dynamic(() => import("./PostEditEditor"), { ssr: false });

interface PostEditEditorLoaderProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialCategoryId: number | null;
}

export default function PostEditEditorLoader({
  id,
  initialTitle,
  initialContent,
  initialCategoryId,
}: PostEditEditorLoaderProps) {
  return (
    <PostEditEditor
      id={id}
      initialTitle={initialTitle}
      initialContent={initialContent}
      initialCategoryId={initialCategoryId}
    />
  );
}
