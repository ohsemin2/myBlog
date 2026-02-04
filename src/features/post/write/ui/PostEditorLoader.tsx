"use client";

import dynamic from "next/dynamic";

const PostEditor = dynamic(() => import("./PostEditor"), { ssr: false });

export default function PostEditorLoader() {
  return <PostEditor />;
}
