import Link from "next/link";
import { simpleButtonStyles } from "@/shared/ui";

export default function LoginButton() {
  return (
    <Link href="/login" className={simpleButtonStyles.simpleButton}>로그인</Link>
  );
}
