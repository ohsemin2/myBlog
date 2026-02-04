import Image from "next/image";
import Pencil from "@/shared/assets/pencil_negative.png";
import styles from "./CreatePost.module.css";

export default function CreatePost() {
  return (
    <div className={styles.wrapper}>
      <button className={` ${styles.createPostButton}`}>
        새 글 작성
        <Image src={Pencil} alt="검색" width={20} height={20} />
      </button>
    </div>
  );
}
