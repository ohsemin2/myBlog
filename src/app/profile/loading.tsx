import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import s from "@/shared/ui/Skeleton.module.css";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.nameSection}>
          <div className={`${s.skeleton} ${styles.nameKo}`} />
          <div className={`${s.skeleton} ${styles.nameEn}`} />
        </section>

        <section className={styles.section}>
          <div className={`${s.skeleton} ${styles.sectionTitle}`} />
          <div className={styles.contactItem}>
            <div className={`${s.skeleton} ${styles.icon}`} />
            <div className={`${s.skeleton} ${styles.contactText}`} />
          </div>
          <div className={styles.contactItem}>
            <div className={`${s.skeleton} ${styles.icon}`} />
            <div className={`${s.skeleton} ${styles.contactText}`} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${s.skeleton} ${styles.sectionTitle}`} />
          <div className={styles.eduRow}>
            <div className={`${s.skeleton} ${styles.eduLogo}`} />
            <div className={styles.eduInfo}>
              <div className={`${s.skeleton} ${styles.eduName}`} />
              <div className={`${s.skeleton} ${styles.eduMajor}`} />
              <div className={`${s.skeleton} ${styles.eduDate}`} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
