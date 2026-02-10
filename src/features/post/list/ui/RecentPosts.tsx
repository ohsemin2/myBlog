import Link from "next/link";
import { createClient } from "@/shared/api/supabase/server";
import PostCard from "./PostCard";
import styles from "./RecentPosts.module.css";
import buttonStyles from "@/shared/ui/SimpleButton.module.css";

export default async function RecentPosts() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("post")
    .select("id, title, content, created_at, published_at")
    .eq("is_draft", false)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!posts || posts.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>최근 작성된 글</h2>
        <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        최근 작성된 글
        <div className={`${styles.moreWrapper}`}>
          <Link href="/posts" className={buttonStyles.simpleButton}>
            더보기
          </Link>
        </div>
      </div>
      <div className={styles.list}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            createdAt={post.published_at ?? post.created_at}
          />
        ))}
      </div>
    </section>
  );
}
