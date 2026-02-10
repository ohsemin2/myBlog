"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/api/supabase/client";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import CategorySelector from "./CategorySelector";
import styles from "./PostEditor.module.css";

export default function PostEditor() {
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
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
    const { error } = await supabase.from("post").insert({
      title: title.trim() || "제목 없음",
      content,
      category: categoryId,
      is_draft: true,
    });

    if (error) {
      alert("임시저장에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/drafts");
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
    const { error } = await supabase.from("post").insert({
      title: title.trim(),
      content,
      category: categoryId,
      is_draft: false,
    });

    if (error) {
      alert("저장에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/");
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
          initialValue=""
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
          className={styles.draftButton}
          onClick={handleDraft}
          disabled={isSubmitting}
        >
          임시저장
        </button>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "발행"}
        </button>
      </div>
    </div>
  );
}
