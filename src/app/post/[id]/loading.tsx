import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import s from "@/shared/ui/Skeleton.module.css";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.header}>
            <div className={`${s.skeleton} ${styles.skTitle}`} />
            <div className={`${s.skeleton} ${styles.skCategory}`} />
            <div className={`${s.skeleton} ${styles.skDate}`} />
          </header>
          <div className={styles.body}>
            <div className={`${s.skeleton} ${styles.skLine}`} />
            <div className={`${s.skeleton} ${styles.skLine}`} />
            <div className={`${s.skeleton} ${styles.skLine} ${styles.skLineShort}`} />
            <div className={`${s.skeleton} ${styles.skLine}`} />
            <div className={`${s.skeleton} ${styles.skLine}`} />
            <div className={`${s.skeleton} ${styles.skLine} ${styles.skLineMid}`} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
