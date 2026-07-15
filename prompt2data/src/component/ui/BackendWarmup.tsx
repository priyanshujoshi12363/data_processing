"use client";

import { useEffect } from "react";

/**
 * Pings the cleaning backend on mount so Render's free tier wakes up before the
 * user actually uploads a file. Fire-and-forget — failures are ignored.
 */
export default function BackendWarmup() {
  useEffect(() => {
    fetch("/api/warmup", { cache: "no-store" }).catch(() => {});
  }, []);
  return null;
}
