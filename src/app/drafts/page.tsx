import { redirect } from "next/navigation";
import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import { PostCard } from "@/features/post/list/ui";
import { createClient } from "@/shared/api/supabase/server";
import styles from "../posts/page.module.css";

export default async function DraftsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: posts } = await supabase
    .from("post")
    .select("id, title, content, created_at")
    .eq("is_draft", true)
    .order("created_at", { ascending: false });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>임시저장된 글</h1>
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
          <p className={styles.empty}>임시저장된 글이 없습니다.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
