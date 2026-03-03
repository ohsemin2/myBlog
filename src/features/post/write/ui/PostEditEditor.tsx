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

  const imageSizeRef = useRef(100);
  const [imageSizeInput, setImageSizeInput] = useState("100");

  const activeImageLineRef = useRef<number | null>(null);
  const [activeImageLine, setActiveImageLine] = useState<number | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  const updateImageInMarkdown = (lineNum: number, newSize: number) => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const markdown = editorInstance.getMarkdown();
    const lines = markdown.split("\n");
    if (lineNum > lines.length) return;

    const lineText = lines[lineNum - 1];
    const imgMatch = lineText.match(/!\[([^\]]*)\]\(([^)#]+)(?:#\d+)?\)/);
    if (!imgMatch || imgMatch.index === undefined) return;

    const finalUrl = newSize < 100 ? `${imgMatch[2]}#${newSize}` : imgMatch[2];
    const newSyntax = `![${imgMatch[1]}](${finalUrl})`;

    const startPos: [number, number] = [lineNum, imgMatch.index + 1];
    const endPos: [number, number] = [lineNum, imgMatch.index + imgMatch[0].length + 1];
    editorInstance.replaceSelection(newSyntax, startPos, endPos);
  };

  const handleSizeInputChange = (val: string) => {
    setImageSizeInput(val);
    const v = parseInt(val, 10);
    if (!isNaN(v) && v >= 10 && v <= 100) {
      imageSizeRef.current = v;
      if (activeImageLineRef.current !== null) {
        updateImageInMarkdown(activeImageLineRef.current, v);
      }
    }
  };

  const handleSizeInputBlur = () => {
    const v = parseInt(imageSizeInput, 10);
    const clamped = isNaN(v) ? 100 : Math.min(100, Math.max(10, v));
    setImageSizeInput(String(clamped));
    imageSizeRef.current = clamped;
  };

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    const container = editorWrapperRef.current;
    if (!editorInstance || !container) return;

    editorInstance.addCommand("markdown", "customIndent", () => {
      editorInstance.insertText("&nbsp;");
      return true;
    });
    editorInstance.addCommand("wysiwyg", "customIndent", () => {
      editorInstance.insertText("&nbsp;");
      return true;
    });

    const detectImageAtCaret = () => {
      try {
        const selection = editorInstance.getSelection() as [[number, number], [number, number]];
        const line = selection[0][0];

        const markdown = editorInstance.getMarkdown();
        const lineText = markdown.split("\n")[line - 1] || "";
        const imageMatch = lineText.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          const url = imageMatch[2];
          const hashIndex = url.lastIndexOf("#");
          let size = 100;
          if (hashIndex !== -1) {
            const pct = parseInt(url.slice(hashIndex + 1), 10);
            if (!isNaN(pct) && pct >= 1 && pct <= 100) size = pct;
          }
          activeImageLineRef.current = line;
          setActiveImageLine(line);
          setImageSizeInput(String(size));
          imageSizeRef.current = size;
        } else {
          activeImageLineRef.current = null;
          setActiveImageLine(null);
        }
      } catch {
        // ignore
      }
    };

    editorInstance.on("caretChange", detectImageAtCaret);
    const handleMouseUp = () => setTimeout(detectImageAtCaret, 0);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      editorInstance.off("caretChange", detectImageAtCaret);
      container.removeEventListener("mouseup", handleMouseUp);
    };
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

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage.from("post-image").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

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
      <CategorySelector value={categoryId} onChange={setCategoryId} />
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
                const size = imageSizeRef.current;
                const finalUrl = size < 100 ? `${url}#${size}` : url;
                callback(finalUrl, "image");
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
