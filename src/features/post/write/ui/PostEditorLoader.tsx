"use client";

import dynamic from "next/dynamic";
import type { Category } from "@/entities/category";

const PostEditor = dynamic(() => import("./PostEditor"), { ssr: false });

interface PostEditorLoaderProps {
  initialCategories: Category[];
}

export default function PostEditorLoader({
  initialCategories,
}: PostEditorLoaderProps) {
  return <PostEditor initialCategories={initialCategories} />;
}
