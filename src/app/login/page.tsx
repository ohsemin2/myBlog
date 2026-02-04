"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/features/auth/api";
import type { AuthState } from "@/features/auth/model";
import styles from "./page.module.css";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    login,
    { error: null }
  );

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.title}>로그인</h1>

        {state.error && <p className={styles.error}>{state.error}</p>}

        <label className={styles.label} htmlFor="email">
          이메일
        </label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          required
        />

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
          {pending ? "로그인 중..." : "로그인"}
        </button>

        <p className={styles.link}>
          계정이 없으신가요? <Link href="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}
