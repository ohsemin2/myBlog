"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/api/supabase/client";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import styles from "./PostEditor.module.css";

export default function PostEditor() {
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState("");
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
        />
      </div>
      <div className={styles.buttonWrapper}>
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
