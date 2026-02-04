"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import openedEye from "@/shared/assets/opened_eye.png";
import closedEye from "@/shared/assets/closed_eye.png";
import { signup } from "@/features/auth/api";
import type { AuthState } from "@/features/auth/model";
import styles from "./page.module.css";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signup, {
    error: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setConfirmError(null);
    formAction(formData);
  }

  return (
    <div className={styles.page}>
      <form action={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>회원가입</h1>

        {(state.error || confirmError) && (
          <p className={styles.error}>{confirmError || state.error}</p>
        )}

        <label className={styles.label} htmlFor="email">
          이메일
        </label>
        <input className={styles.input} id="email" name="email" type="email" required />

        <label className={styles.label} htmlFor="password">
          비밀번호
        </label>
        <div className={styles.passwordWrapper}>
          <input
            className={styles.passwordInput}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? openedEye : closedEye}
              alt="비밀번호 표시"
              width={20}
              height={20}
            />
          </button>
        </div>

        <label className={styles.label} htmlFor="confirmPassword">
          비밀번호 확인
        </label>
        <div className={styles.passwordWrapper}>
          <input
            className={styles.passwordInput}
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            <Image
              src={showConfirm ? openedEye : closedEye}
              alt="비밀번호 표시"
              width={20}
              height={20}
            />
          </button>
        </div>

        <button className={styles.submitButton} type="submit" disabled={pending}>
          {pending ? "가입 중..." : "회원가입"}
        </button>

        <p className={styles.link}>
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}
