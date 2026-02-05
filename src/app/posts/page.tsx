import { Header } from "@/widgets/header/ui";
import { PostCard } from "@/features/post/list/ui";
import { createClient } from "@/shared/api/supabase/server";
import styles from "./page.module.css";

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("post")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>모든 글</h1>
        {posts && posts.length > 0 ? (
          <div className={styles.list}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                createdAt={post.created_at}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
        )}
      </main>
    </div>
  );
}
