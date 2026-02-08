import { SearchBar } from "@/features/search/ui";
import { AuthButtons } from "@/features/auth/ui";
import { createClient } from "@/shared/api/supabase/server";
import { CreatePost } from "@/features/post/create/ui";
import { Sidebar } from "@/widgets/sidebar/ui";
import styles from "./Header.module.css";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          {user && <CreatePost />}
          <AuthButtons user={user} />
        </div>
      </div>

      <div className={styles.mobileSearch}>
        <SearchBar />
      </div>
    </header>
  );
}
