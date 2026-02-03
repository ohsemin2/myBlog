import { Header } from "@/widgets/header/ui";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        {/* 메인 콘텐츠 영역 */}
      </main>
    </div>
  );
}
