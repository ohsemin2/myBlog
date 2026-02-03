import Image from "next/image";
import readingGlasses from "@/shared/assets/reading_glasses.png";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className={styles.input}
      />
      <button className={styles.searchButton}>
        <Image
          src={readingGlasses}
          alt="검색"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
