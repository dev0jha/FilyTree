"use client";
import { create } from "zustand";

interface AppState {
  groqKey: string;
  view: "home" | "canvas" | "analysis";
  setGroqKey: (key: string) => void;
  setView: (view: "home" | "canvas" | "analysis") => void;
}
export const useAppStore = create<AppState>((set) => ({
  groqKey: "",
  view: "home",
  setGroqKey: (key) => {
    localStorage.setItem("filytree-groq-key", key);
    set({ groqKey: key });
  },
  setView: (view) => set({ view }),
}));
