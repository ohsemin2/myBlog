"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Editor } from "@toast-ui/react-editor";
import { addImageSizeFragment, parseSizedImageUrl } from "@/shared/lib/markdownImage";

const IMAGE_LINE_PATTERN = /!\[([^\]]*)\]\(([^)#]+)(?:#\d+)?\)/;
const ANY_IMAGE_LINE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/;

function getMarkdownLine(markdown: string, lineNumber: number) {
  if (lineNumber < 1) return null;

  let start = 0;
  for (let currentLine = 1; currentLine < lineNumber; currentLine += 1) {
    const nextLineStart = markdown.indexOf("\n", start);
    if (nextLineStart === -1) return null;
    start = nextLineStart + 1;
  }

  const end = markdown.indexOf("\n", start);
  return markdown.slice(start, end === -1 ? markdown.length : end);
}

export function useEditorImageSizing(editorRef: RefObject<Editor | null>) {
  const imageSizeRef = useRef(100);
  const activeImageLineRef = useRef<number | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [imageSizeInput, setImageSizeInput] = useState("100");
  const [activeImageLine, setActiveImageLine] = useState<number | null>(null);

  const updateImageInMarkdown = useCallback(
    (lineNum: number, newSize: number) => {
      const editorInstance = editorRef.current?.getInstance();
      if (!editorInstance) return;

      const lineText = getMarkdownLine(editorInstance.getMarkdown(), lineNum);
      if (lineText === null) return;

      const imgMatch = lineText.match(IMAGE_LINE_PATTERN);
      if (!imgMatch || imgMatch.index === undefined) return;

      const finalUrl = addImageSizeFragment(imgMatch[2], newSize);
      const newSyntax = `![${imgMatch[1]}](${finalUrl})`;

      const startPos: [number, number] = [lineNum, imgMatch.index + 1];
      const endPos: [number, number] = [
        lineNum,
        imgMatch.index + imgMatch[0].length + 1,
      ];
      editorInstance.replaceSelection(newSyntax, startPos, endPos);
    },
    [editorRef]
  );

  const handleSizeInputChange = useCallback(
    (val: string) => {
      setImageSizeInput(val);
      const nextSize = Number.parseInt(val, 10);
      if (Number.isNaN(nextSize) || nextSize < 10 || nextSize > 100) return;

      imageSizeRef.current = nextSize;
      if (activeImageLineRef.current !== null) {
        updateImageInMarkdown(activeImageLineRef.current, nextSize);
      }
    },
    [updateImageInMarkdown]
  );

  const handleSizeInputBlur = useCallback(() => {
    const nextSize = Number.parseInt(imageSizeInput, 10);
    const clamped = Number.isNaN(nextSize)
      ? 100
      : Math.min(100, Math.max(10, nextSize));
    setImageSizeInput(String(clamped));
    imageSizeRef.current = clamped;
  }, [imageSizeInput]);

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
        const selection = editorInstance.getSelection() as [
          [number, number],
          [number, number],
        ];
        const line = selection[0][0];
        const lineText = getMarkdownLine(editorInstance.getMarkdown(), line) ?? "";
        const imageMatch = lineText.match(ANY_IMAGE_LINE_PATTERN);

        if (!imageMatch) {
          activeImageLineRef.current = null;
          setActiveImageLine((prev) => (prev === null ? prev : null));
          return;
        }

        const { widthPct } = parseSizedImageUrl(imageMatch[2]);
        activeImageLineRef.current = line;
        setActiveImageLine((prev) => (prev === line ? prev : line));
        setImageSizeInput((prev) =>
          prev === String(widthPct) ? prev : String(widthPct)
        );
        imageSizeRef.current = widthPct;
      } catch {
        // Toast UI can briefly expose an invalid selection while focus moves.
      }
    };

    editorInstance.on("caretChange", detectImageAtCaret);
    const handleMouseUp = () => setTimeout(detectImageAtCaret, 0);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      editorInstance.off("caretChange", detectImageAtCaret);
      container.removeEventListener("mouseup", handleMouseUp);
    };
  }, [editorRef]);

  return {
    activeImageLine,
    editorWrapperRef,
    handleSizeInputBlur,
    handleSizeInputChange,
    imageSizeInput,
    imageSizeRef,
  };
}
