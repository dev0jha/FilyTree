"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
export function Shell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const { setGroqKey } = useAppStore();
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("filytree-groq-key");
    const envKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (stored) {
      setGroqKey(stored);
    } else if (envKey) {
      setGroqKey(envKey);
      localStorage.setItem("filytree-groq-key", envKey);
    } else {
      setShowKeyInput(true);
    }
  }, [setGroqKey]);
  if (!mounted) return null;
  return <>{children}</>;
}
