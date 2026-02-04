import Link from "next/link";
import { simpleButtonStyles } from "@/shared/ui";

export default function SignupButton() {
  return (
    <Link href="/signup" className={simpleButtonStyles.simpleButton}>회원가입</Link>
  );
}
