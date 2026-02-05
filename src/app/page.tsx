import { Header } from "@/widgets/header/ui";
import { RecentPosts } from "@/features/post/list/ui";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <RecentPosts />
      </main>
    </div>
  );
}
