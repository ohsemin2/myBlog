import { SearchBar } from "@/features/search/ui";
import { AuthButtonsClient } from "@/features/auth/ui";
import { Sidebar } from "@/widgets/sidebar/ui";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Sidebar />
          <Link href="/" className={styles.blogName}>
            Semin&apos;s Blog
          </Link>
        </div>

        <div className={styles.center}>
          <SearchBar />
        </div>

        <div className={styles.right}>
          <AuthButtonsClient />
        </div>
      </div>

      <div className={styles.mobileSearch}>
        <SearchBar />
      </div>
    </header>
  );
}
