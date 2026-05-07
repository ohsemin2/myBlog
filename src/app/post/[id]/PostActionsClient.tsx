"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import pencilIcon from "@/shared/assets/pencil.png";
import styles from "./page.module.css";
import DeleteButton from "./DeleteButton";

interface PostActionsClientProps {
  postId: string;
}

export default function PostActionsClient({ postId }: PostActionsClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    import("@/shared/api/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data }) => {
        if (isMounted) {
          setIsLoggedIn(!!data.user);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.actionButtons}>
      <Link href={`/post/${postId}/edit`} className={styles.editButton}>
        <Image src={pencilIcon} alt="수정" width={16} height={16} />
      </Link>
      <DeleteButton postId={postId} />
    </div>
  );
}
