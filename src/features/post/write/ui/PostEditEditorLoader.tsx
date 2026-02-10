"use client";

import dynamic from "next/dynamic";

const PostEditEditor = dynamic(() => import("./PostEditEditor"), { ssr: false });

interface PostEditEditorLoaderProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialCategoryId: number | null;
  isDraft: boolean;
}

export default function PostEditEditorLoader({
  id,
  initialTitle,
  initialContent,
  initialCategoryId,
  isDraft,
}: PostEditEditorLoaderProps) {
  return (
    <PostEditEditor
      id={id}
      initialTitle={initialTitle}
      initialContent={initialContent}
      initialCategoryId={initialCategoryId}
      isDraft={isDraft}
    />
  );
}
