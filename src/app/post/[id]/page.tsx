import { notFound } from "next/navigation";
import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import { getPostById, getCategories } from "@/shared/api/supabase/queries";
import { formatKoreanDate } from "@/shared/lib/date";
import styles from "./page.module.css";
import MarkdownContent from "./MarkdownContent";
import PostActionsClient from "./PostActionsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 30;

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  let categoryBreadcrumb: string | null = null;
  if (post.category) {
    const allCategories = await getCategories();
    const catMap = new Map(allCategories.map((c) => [c.id, c]));
    const parts: string[] = [];
    let current = catMap.get(post.category);
    while (current) {
      parts.unshift(current.name);
      current = current.parent_id !== null ? catMap.get(current.parent_id) : undefined;
    }
    categoryBreadcrumb = parts.join(" > ");
  }

  const date = formatKoreanDate(post.published_at ?? post.created_at);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            {categoryBreadcrumb && (
              <p className={styles.categoryBreadcrumb}>{categoryBreadcrumb}</p>
            )}
            <div className={styles.dateRow}>
              <time className={styles.date}>{date}</time>
              <PostActionsClient postId={post.id} />
            </div>
          </header>
          <MarkdownContent content={post.content || ""} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
