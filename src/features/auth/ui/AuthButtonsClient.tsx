"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { CreatePost } from "@/features/post/create/ui";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import LogoutButton from "./LogoutButton";
import styles from "./AuthButtons.module.css";

export default function AuthButtonsClient() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    import("@/shared/api/supabase/client").then(({ createClient }) => {
      if (!isMounted) return;

      const supabase = createClient();

      supabase.auth.getSession().then(({ data }) => {
        if (isMounted) {
          setUser(data.session?.user ?? null);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {user ? (
        <>
          <CreatePost />
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
