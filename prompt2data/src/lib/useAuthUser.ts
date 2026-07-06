"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFreshToken, saveUserInfo, type UserInfo } from "@/lib/auth";

export interface AuthState {
  user: UserInfo | null;
  loading: boolean;
  setCredits: (credits: number) => void;
}

export function useAuthUser(): AuthState {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await getFreshToken();
        const res = await fetch("/api/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const info: UserInfo = {
            uid: data.user.uid,
            name: data.user.name,
            email: data.user.email,
            picture: data.user.image,
            credits: data.user.credits,
            plan: data.user.plan,
          };
          saveUserInfo(info);
          setUser(info);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const setCredits = (credits: number) =>
    setUser((prev) => (prev ? { ...prev, credits } : prev));

  return { user, loading, setCredits };
}
