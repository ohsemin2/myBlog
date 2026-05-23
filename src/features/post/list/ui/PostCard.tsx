import Link from "next/link";
import Image from "next/image";
import { formatKoreanDate } from "@/shared/lib/date";
import { parseSizedImageUrl } from "@/shared/lib/markdownImage";
import styles from "./PostCard.module.css";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const PREVIEW_SOURCE_LIMIT = 1000;
const THUMBNAIL_SOURCE_LIMIT = 6000;

function extractFirstImage(markdown: string): string | null {
  const imageRegex = /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/;
  const match = markdown.match(imageRegex);
  return match ? parseSizedImageUrl(match[1]).src : null;
}

// 마크다운에서 이미지, LaTeX, 링크 등 제거하고 순수 텍스트만 추출
function extractPlainText(markdown: string): string {
  let text = markdown;
  // 코드 블록 먼저 제거 (다른 패턴과 충돌 방지)
  text = text.replace(/```[\s\S]*?```/g, " ");
  // 이미지 제거
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");
  // LaTeX 수식의 $ 기호만 제거하고 내용은 유지 ($$...$$, $...$)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
  text = text.replace(/\$([^$\n]+?)\$/g, "$1");
  // 링크를 텍스트로 변환 [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  // 헤딩 마커 제거
  text = text.replace(/^#+\s+/gm, "");
  // 볼드, 이탤릭 마커 제거
  text = text.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1");
  // 인라인 코드 제거
  text = text.replace(/`([^`]+)`/g, "$1");
  // &nbsp; 제거
  text = text.replace(/&nbsp;/g, " ");
  // 연속된 공백을 하나로
  text = text.replace(/\s+/g, " ");
  return text.trim();
}

export default function PostCard({ id, title, content, createdAt }: PostCardProps) {
  const thumbnailSource = content.slice(0, THUMBNAIL_SOURCE_LIMIT);
  const thumbnailUrl = extractFirstImage(thumbnailSource);
  const contentHead = content.slice(0, PREVIEW_SOURCE_LIMIT);
  const preview = extractPlainText(contentHead);
  const date = formatKoreanDate(createdAt);

  return (
    <div className={styles.wrapper}>
      <Link href={`/post/${id}`} className={styles.card}>
        <div className={styles.contentArea}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.preview}>{preview}</p>
          <span className={styles.date}>{date}</span>
        </div>
        {thumbnailUrl && (
          <div className={styles.thumbnailArea}>
            <Image
              src={thumbnailUrl}
              alt="Post thumbnail"
              width={110}
              height={110}
              className={styles.thumbnail}
              sizes="110px"
              style={{ borderRadius: "3px" }}
            />
          </div>
        )}
      </Link>
      <hr className={styles.hr} />
    </div>
  );
}
