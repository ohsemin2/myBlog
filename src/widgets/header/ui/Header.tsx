import Image from "next/image";
import linesIcon from "@/shared/assets/lines.png";
import { SearchBar } from "@/features/search/ui";
import { AuthButtons } from "@/features/auth/ui";
import { createClient } from "@/shared/api/supabase/server";
import { CreatePost } from "@/features/post/create/ui";
import styles from "./Header.module.css";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button className={styles.menuButton}>
            <Image src={linesIcon} alt="메뉴" width={20} height={20} />
          </button>
          <span className={styles.blogName}>Semin&apos;s Blog</span>
        </div>

        <div className={styles.center}>
          <SearchBar />
        </div>

        <div className={styles.right}>
          <CreatePost />
          <AuthButtons user={user} />
        </div>
      </div>

      <div className={styles.mobileSearch}>
        <SearchBar />
      </div>
    </header>
  );
}
