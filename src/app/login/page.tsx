"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import openedEye from "@/shared/assets/opened_eye.png";
import closedEye from "@/shared/assets/closed_eye.png";
import { login } from "@/features/auth/api";
import type { AuthState } from "@/features/auth/model";
import styles from "./page.module.css";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    login,
    { error: null }
  );
  const [showPassword, setShowPassword] = useState(false);

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
