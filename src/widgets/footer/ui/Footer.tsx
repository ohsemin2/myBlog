import Image from "next/image";
import clipIcon from "@/shared/assets/clip.png";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          이 블로그에 사용된 일부 아이콘은 FLATICON에서 제공되었습니다.
        </p>
        <a
          href="https://www.flaticon.com/kr/packs/essential-set-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={clipIcon} alt="Flaticon essential-set-2" width={16} height={16} />
        </a>
        <a
          href="https://www.flaticon.com/kr/packs/emails"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={clipIcon} alt="Flaticon emails" width={16} height={16} />
        </a>
      </div>
    </footer>
  );
}
