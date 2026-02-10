"use client";

import { useEffect, useRef, useState } from "react";
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
  isDraft: boolean;
}

export default function PostEditEditor({
  id,
  initialTitle,
  initialContent,
  initialCategoryId,
  isDraft,
}: PostEditEditorProps) {
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    editorInstance.addCommand("markdown", "customIndent", () => {
      editorInstance.insertText("&nbsp;");
      return true;
    });
    editorInstance.addCommand("wysiwyg", "customIndent", () => {
      editorInstance.insertText("&nbsp;");
      return true;
    });
  }, []);

  const toolbarItems = [
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

  const handleDraft = async () => {
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown() ?? "";

    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("post")
      .update({
        title: title.trim() || "제목 없음",
        content,
        category: categoryId,
        is_draft: true,
      })
      .eq("id", id);

    if (error) {
      alert("임시저장에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/drafts");
  };

  const handlePublish = async () => {
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
        is_draft: false,
      })
      .eq("id", id);

    if (error) {
      alert("발행에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push(`/post/${id}`);
  };

  const handleUpdate = async () => {
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
        {isDraft ? (
          <>
            <button
              className={styles.draftButton}
              onClick={handleDraft}
              disabled={isSubmitting}
            >
              임시저장
            </button>
            <button
              className={styles.submitButton}
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? "발행 중..." : "발행"}
            </button>
          </>
        ) : (
          <button
            className={styles.submitButton}
            onClick={handleUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정"}
          </button>
        )}
      </div>
    </div>
  );
}
