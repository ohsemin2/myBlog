"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/features/auth/api";
import type { AuthState } from "@/features/auth/model";
import styles from "./page.module.css";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signup, {
    error: null,
  });

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.title}>회원가입</h1>

        {state.error && <p className={styles.error}>{state.error}</p>}

        <label className={styles.label} htmlFor="email">
          이메일
        </label>
        <input className={styles.input} id="email" name="email" type="email" required />

        <label className={styles.label} htmlFor="password">
          비밀번호
        </label>
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          required
        />

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
