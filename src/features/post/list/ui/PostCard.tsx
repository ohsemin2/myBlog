import Link from "next/link";
import styles from "./PostCard.module.css";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function PostCard({ id, title, content, createdAt }: PostCardProps) {
  const preview = content.length > 150 ? content.slice(0, 150) + "..." : content;
  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/post/${id}`} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.preview}>{preview}</p>
      <span className={styles.date}>{date}</span>
    </Link>
  );
}
