"use client";
import { useState } from "react";
import { Key } from "@phosphor-icons/react";
interface ApiKeyInputProps {
  onSave?: (key: string) => void;
}
export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
  const [input, setInput] = useState("");
  const handleSave = () => {
    if (input.trim()) onSave?.(input.trim());
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[#181818] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        <div className="w-12 h-12 rounded-2xl bg-[rgba(61,138,107,0.12)] border border-[rgba(61,138,107,0.25)] flex items-center justify-center mb-6">
          <Key weight="bold" size={24} className="text-[#3d8a6b]" />
        </div>
        <h2 className="text-2xl font-bold tracking-tighter text-white mb-2">
          Enter your Groq API key
        </h2>
        <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed mb-6">
          Your key is stored locally in this browser only. It is sent directly
          to Groq — never to any third-party server.
        </p>
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
            Groq API Key
          </label>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="gsk_..."
            autoFocus
            className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[rgba(61,138,107,0.3)] focus:border-[rgba(61,138,107,0.4)] outline-none transition-all"
          />
        </div>
        <p className="mt-3 text-xs text-[rgba(255,255,255,0.25)]">
          Get a free key at{" "}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3d8a6b] hover:text-[#4a9f7e] underline"
          >
            console.groq.com/keys
          </a>
        </p>
        <button
          onClick={handleSave}
          disabled={!input.trim()}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#3d8a6b] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#4a9f7e] active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-[#3d8a6b]"
        >
          Save Key & Continue
        </button>
      </div>
    </div>
  );
}
