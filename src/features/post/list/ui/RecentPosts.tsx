import Link from "next/link";
import { getRecentPublishedPosts } from "@/shared/api/supabase/queries";
import PostCard from "./PostCard";
import styles from "./RecentPosts.module.css";
import buttonStyles from "@/shared/ui/SimpleButton.module.css";

export default async function RecentPosts() {
  const posts = await getRecentPublishedPosts(5);

  if (posts.length === 0) {
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
            content={post.content ?? ""}
            createdAt={post.published_at ?? post.created_at}
          />
        ))}
      </div>
    </section>
  );
}
