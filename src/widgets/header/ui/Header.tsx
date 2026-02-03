import Image from "next/image";
import linesIcon from "@/shared/assets/lines.png";
import { SearchBar } from "@/features/search/ui";
import { AuthButtons } from "@/features/auth/ui";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <span className={styles.blogName}>Semin</span>
          <button className={styles.menuButton}>
            <Image
              src={linesIcon}
              alt="메뉴"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className={styles.center}>
          <SearchBar />
        </div>

        <AuthButtons />
      </div>

      <div className={styles.mobileSearch}>
        <SearchBar />
      </div>
    </header>
  );
}
