"use client";

import { createClient } from "@/shared/api/supabase/client";
import { addImageSizeFragment } from "@/shared/lib/markdownImage";

export const editorToolbarItems = [
  ["heading", "bold", "italic", "strike"],
  ["hr", "quote"],
  [
    "ul",
    "ol",
    "task",
    {
      name: "customIndent",
      tooltip: "Indent",
      command: "customIndent",
      className: "toastui-editor-toolbar-icons indent",
    },
  ],
  ["table", "image", "link"],
  ["code", "codeblock"],
  ["scrollSync"],
];

export async function uploadPostImage(blob: Blob): Promise<string> {
  const supabase = createClient();
  const fileName = `${Date.now()}-${crypto.randomUUID()}`;
  const { data, error } = await supabase.storage
    .from("post-image")
    .upload(fileName, blob);

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from("post-image")
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}

export function formatEditorImageUrl(url: string, widthPct: number) {
  return addImageSizeFragment(url, widthPct);
}
