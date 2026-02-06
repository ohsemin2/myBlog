import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Header } from "@/widgets/header/ui";
import { createClient } from "@/shared/api/supabase/server";
import pencilIcon from "@/shared/assets/pencil.png";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("post")
    .select("id, title, content, created_at")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.dateRow}>
              <time className={styles.date}>{date}</time>
              {user && (
                <Link href={`/post/${post.id}/edit`} className={styles.editButton}>
                  <Image src={pencilIcon} alt="수정" width={16} height={16} />
                </Link>
              )}
            </div>
          </header>
          <div className={styles.content}>
            <Markdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {post.content || ""}
            </Markdown>
          </div>
        </article>
      </main>
    </div>
  );
}
