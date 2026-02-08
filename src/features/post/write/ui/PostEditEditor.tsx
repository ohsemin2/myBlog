"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/api/supabase/client";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import CategorySelector from "./CategorySelector";
import styles from "./PostEditor.module.css";

interface PostEditEditorProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialCategoryId: number | null;
}

export default function PostEditEditor({
  id,
  initialTitle,
  initialContent,
  initialCategoryId,
}: PostEditEditorProps) {
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr", "quote"],
    ["ul", "ol", "task", "indent", "outdent"],
    ["table", "image", "link"],
    ["code", "codeblock"],
    ["scrollSync"],
  ];

  const uploadImage = async (blob: Blob): Promise<string> => {
    const supabase = createClient();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const { data, error } = await supabase.storage
      .from("post-image")
      .upload(fileName, blob);

    if (error) {
      throw new Error(error.message);
    }

    const { data: urlData } = supabase.storage.from("post-image").getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력하세요");
      return;
    }

    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown();

    if (!content?.trim()) {
      alert("내용을 입력하세요");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("post")
      .update({
        title: title.trim(),
        content,
        category: categoryId,
      })
      .eq("id", id);

    if (error) {
      alert("수정에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push(`/post/${id}`);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.titleInput}
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <CategorySelector value={categoryId} onChange={setCategoryId} />
      <div className={styles.editorWrapper}>
        <Editor
          ref={editorRef}
          initialEditType="markdown"
          previewStyle="vertical"
          height="calc(100vh - 260px)"
          initialValue={initialContent || ""}
          toolbarItems={toolbarItems}
          placeholder="내용을 입력해주세요"
          language="ko-KR"
          hooks={{
            addImageBlobHook: async (
              blob: Blob,
              callback: (url: string, alt: string) => void,
            ) => {
              try {
                const url = await uploadImage(blob);
                callback(url, "image");
              } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드에 실패했습니다.");
              }
            },
          }}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "수정 중..." : "수정"}
        </button>
      </div>
    </div>
  );
}
