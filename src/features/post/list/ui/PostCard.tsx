import Link from "next/link";
import Image from "next/image";
import styles from "./PostCard.module.css";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// 마크다운에서 첫 번째 이미지 URL 추출
function extractFirstImage(markdown: string): string | null {
  // ![alt](url) 형식의 이미지 추출
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : null;
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
  // 연속된 공백을 하나로
  text = text.replace(/\s+/g, " ");
  return text.trim();
}

export default function PostCard({ id, title, content, createdAt }: PostCardProps) {
  const thumbnailUrl = extractFirstImage(content);
  const plainText = extractPlainText(content);
  const preview = plainText.slice(0, 150); // 미리보기 길이 제한

  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            />
          </div>
        )}
      </Link>
      <hr className={styles.hr} />
    </div>
  );
}
