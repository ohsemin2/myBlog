"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/shared/api/supabase/client";
import trashIcon from "@/shared/assets/trash.png";
import styles from "./page.module.css";

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("post").delete().eq("id", postId);

    if (error) {
      alert("삭제에 실패했습니다: " + error.message);
      return;
    }

    router.push("/");
  };

  return (
    <button onClick={handleDelete} className={styles.editButton}>
      <Image src={trashIcon} alt="삭제" width={16} height={16} />
    </button>
  );
}
