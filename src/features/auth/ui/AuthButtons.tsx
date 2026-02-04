import type { User } from "@supabase/supabase-js";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import LogoutButton from "./LogoutButton";
import styles from "./AuthButtons.module.css";

interface AuthButtonsProps {
  user: User | null;
}

export default function AuthButtons({ user }: AuthButtonsProps) {
  return (
    <div className={styles.wrapper}>
      {user ? (
        <>
          <LogoutButton />
        </>
      ) : (
        <>
          <LoginButton />
          <SignupButton />
        </>
      )}
    </div>
  );
}
