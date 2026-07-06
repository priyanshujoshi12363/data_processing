"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import {
  loginWithGoogle,
  loginWithGithub,
  onAuthChange,
  isAuthenticated,
} from "@/lib/auth";

const PERKS = [
  "100 free credits on signup",
  "Your data is never stored",
  "Any format — CSV, Excel, JSON",
];

export default function LoginPage() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
      return;
    }
    const unsub = onAuthChange((userInfo) => {
      if (userInfo) router.push("/dashboard");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleGithub = async () => {
    setIsGithubLoading(true);
    setError("");
    try {
      await loginWithGithub();
      router.push("/dashboard");
    } catch {
      setError("Failed to sign in with GitHub. Please try again.");
      setIsGithubLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin-slow rounded-full border-[3px] border-brand-100 border-t-brand" />
          <p className="text-sm text-ash">Checking your session…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* left — brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand/25 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-grass/25 blur-3xl animate-blob [animation-delay:4s]" />

        <Link href="/" className="relative flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-ink">
            P2
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Prompt<span className="text-brand">2</span>Data
          </span>
        </Link>

        <div className="relative">
          <h2 className="max-w-sm text-4xl font-bold leading-tight text-white">
            Clean any dataset with a{" "}
            <span className="text-gradient">single prompt</span>.
          </h2>
          <ul className="mt-8 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-gray-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grass/20 text-grass-400">
                  <FiCheck size={12} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-gray-500">
          Powered by gpt-oss on Ollama Cloud
        </p>
      </div>

      {/* right — auth card */}
      <div className="relative flex items-center justify-center px-5 py-10">
        <div className="grid-bg pointer-events-none absolute inset-0 lg:hidden" />
        <div className="animate-scale-in relative w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ash transition-colors hover:text-ink"
          >
            <FiArrowLeft size={15} /> Back to home
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Welcome to Prompt2Data
          </h1>
          <p className="mt-2 text-sm text-ash">
            Sign in to start cleaning your datasets. New here? An account is
            created automatically.
          </p>

          {error && (
            <div className="animate-fade-in mt-5 rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-center text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-7 space-y-3">
            <button
              onClick={handleGoogle}
              disabled={isGoogleLoading || isGithubLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-brand text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-600 hover:shadow-xl disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <FcGoogle className="h-4 w-4" />
                  </span>
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={handleGithub}
              disabled={isGoogleLoading || isGithubLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-ink transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
              {isGithubLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin-slow rounded-full border-2 border-gray-300 border-t-ink" />
                  Signing in…
                </>
              ) : (
                <>
                  <FaGithub className="h-5 w-5" />
                  Continue with GitHub
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-grass-50 py-2 text-xs font-medium text-grass">
            <FiCheck size={13} /> Get 100 free credits on signup
          </div>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-ash">
            By continuing you agree to our Terms and Privacy Policy. Your
            uploaded data is processed in memory and never stored.
          </p>
        </div>
      </div>
    </main>
  );
}
