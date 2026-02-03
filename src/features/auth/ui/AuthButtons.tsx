import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import styles from "./AuthButtons.module.css";

export default function AuthButtons() {
  return (
    <div className={styles.wrapper}>
      <LoginButton />
      <SignupButton />
    </div>
  );
}
