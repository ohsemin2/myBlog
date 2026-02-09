import Image from "next/image";
import { Header } from "@/widgets/header/ui";
import githubLogo from "@/shared/assets/GitHub-Logo.png";
import snuLogo from "@/shared/assets/snu.png";
import styles from "./page.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.nameSection}>
          <h1 className={styles.nameKo}>오세민</h1>
          <p className={styles.nameEn}>Semin Oh</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <div className={styles.contactRow}>
            <a
              href="https://github.com/ohsemin2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={githubLogo} alt="GitHub" width={50} height={50} />
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.educationRow}>
            <Image
              src={snuLogo}
              alt="Seoul National University College of Liberal Studies"
              width={54}
              height={54}
              className={styles.eduLogo}
            />
            <div className={styles.eduInfo}>
              <p className={styles.eduName}>
                Seoul National University College of Liberal Studies
              </p>
              <p className={styles.eduMajor}>
                Economics, Computer Science and Engineering
              </p>
              <p className={styles.eduMajor}>2023.03~</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
