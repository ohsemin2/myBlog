import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import s from "@/shared/ui/Skeleton.module.css";
import styles from "./loading.module.css";

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.contentArea}>
        <div className={`${s.skeleton} ${styles.title}`} />
        <div className={`${s.skeleton} ${styles.line}`} />
        <div className={`${s.skeleton} ${styles.lineShort}`} />
        <div className={`${s.skeleton} ${styles.date}`} />
      </div>
      <div className={`${s.skeleton} ${styles.thumbnail}`} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={`${s.skeleton} ${styles.heading}`} />
        <SkeletonCard />
        <hr className={styles.hr} />
        <SkeletonCard />
        <hr className={styles.hr} />
        <SkeletonCard />
      </main>
      <Footer />
    </div>
  );
}
