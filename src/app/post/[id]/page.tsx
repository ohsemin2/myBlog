import { notFound } from "next/navigation";
import { Header } from "@/widgets/header/ui";
import { createClient } from "@/shared/api/supabase/server";
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
            <time className={styles.date}>{date}</time>
          </header>
          <div className={styles.content}>
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
}
