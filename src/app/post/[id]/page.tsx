import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import { createClient } from "@/shared/api/supabase/server";
import { getUser, getCategories } from "@/shared/api/supabase/queries";
import pencilIcon from "@/shared/assets/pencil.png";
import styles from "./page.module.css";
import MarkdownContent from "./MarkdownContent";
import DeleteButton from "./DeleteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("post")
    .select("id, title, content, created_at, published_at, category")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  const user = await getUser();

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

  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });

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
              {user && (
                <div className={styles.actionButtons}>
                  <Link href={`/post/${post.id}/edit`} className={styles.editButton}>
                    <Image src={pencilIcon} alt="수정" width={16} height={16} />
                  </Link>
                  <DeleteButton postId={post.id} />
                </div>
              )}
            </div>
          </header>
          <MarkdownContent content={post.content || ""} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
