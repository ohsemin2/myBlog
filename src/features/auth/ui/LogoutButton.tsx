import { logout } from "@/features/auth/api";
import { simpleButtonStyles } from "@/shared/ui";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className={simpleButtonStyles.simpleButton}>
        로그아웃
      </button>
    </form>
  );
}
