"use client";

import dynamic from "next/dynamic";

const PostEditEditor = dynamic(() => import("./PostEditEditor"), { ssr: false });

interface PostEditEditorLoaderProps {
  id: string;
  initialTitle: string;
  initialContent: string;
}

export default function PostEditEditorLoader({
  id,
  initialTitle,
  initialContent,
}: PostEditEditorLoaderProps) {
  return (
    <PostEditEditor
      id={id}
      initialTitle={initialTitle}
      initialContent={initialContent}
    />
  );
}
