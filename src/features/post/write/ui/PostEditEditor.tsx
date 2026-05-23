"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/api/supabase/client";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import type { Category } from "@/entities/category";
import CategorySelector from "./CategorySelector";
import {
  editorToolbarItems,
  formatEditorImageUrl,
  uploadPostImage,
} from "./editorHelpers";
import { useEditorImageSizing } from "./useEditorImageSizing";
import styles from "./PostEditor.module.css";

interface PostEditEditorProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialCategoryId: number | null;
  initialCategories: Category[];
  isDraft: boolean;
}

export default function PostEditEditor({
  id,
  initialTitle,
  initialContent,
  initialCategoryId,
  initialCategories,
  isDraft,
}: PostEditEditorProps) {
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    activeImageLine,
    editorWrapperRef,
    handleSizeInputBlur,
    handleSizeInputChange,
    imageSizeInput,
    imageSizeRef,
  } = useEditorImageSizing(editorRef);

  const handleDraft = async () => {
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown() ?? "";
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("post").update({
      title: title.trim() || "제목 없음",
      content,
      category: categoryId,
      is_draft: true,
    }).eq("id", id);
    if (error) {
      alert("임시저장에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }
    router.push("/drafts");
  };

  const handlePublish = async () => {
    if (!title.trim()) { alert("제목을 입력하세요"); return; }
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown();
    if (!content?.trim()) { alert("내용을 입력하세요"); return; }
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("post").update({
      title: title.trim(),
      content,
      category: categoryId,
      is_draft: false,
    }).eq("id", id);
    if (error) {
      alert("발행에 실패했습니다: " + error.message);
      setIsSubmitting(false);
      return;
    }
    router.push(`/post/${id}`);
  };

  const handleUpdate = async () => {
    if (!title.trim()) { alert("제목을 입력하세요"); return; }
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown();
    if (!content?.trim()) { alert("내용을 입력하세요"); return; }
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("post").update({
      title: title.trim(),
      content,
      category: categoryId,
    }).eq("id", id);
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
      <CategorySelector
        value={categoryId}
        onChange={setCategoryId}
        initialCategories={initialCategories}
      />
      <div className={styles.editorWrapper} ref={editorWrapperRef}>
        <div className={styles.imageToolbar}>
          <span className={styles.imageToolbarLabel}>이미지 크기</span>
          <input
            type="number"
            min={10}
            max={100}
            value={imageSizeInput}
            onChange={(e) => handleSizeInputChange(e.target.value)}
            onBlur={handleSizeInputBlur}
            className={styles.sizeInput}
          />
          <span className={styles.pctLabel}>%</span>
          <span className={styles.imageToolbarHint}>
            {activeImageLine !== null ? "· 선택된 이미지" : "· 다음 삽입 기본값"}
          </span>
        </div>
        <Editor
          ref={editorRef}
          initialEditType="markdown"
          previewStyle="vertical"
          height="calc(100vh - 300px)"
          initialValue={initialContent || ""}
          toolbarItems={editorToolbarItems}
          placeholder="내용을 입력해주세요"
          language="ko-KR"
          hooks={{
            addImageBlobHook: async (
              blob: Blob,
              callback: (url: string, alt: string) => void,
            ) => {
              try {
                const url = await uploadPostImage(blob);
                callback(formatEditorImageUrl(url, imageSizeRef.current), "image");
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
            <button className={styles.draftButton} onClick={handleDraft} disabled={isSubmitting}>
              임시저장
            </button>
            <button className={styles.submitButton} onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? "발행 중..." : "발행"}
            </button>
          </>
        ) : (
          <button className={styles.submitButton} onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "수정"}
          </button>
        )}
      </div>
    </div>
  );
}
