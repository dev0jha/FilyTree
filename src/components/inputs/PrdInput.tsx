"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTreeStore } from "@/stores/tree-store";
import { generateTreeFromPrd } from "@/lib/groq"; 
import { Lightning, Sparkle, Browser, Code, WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
interface PrdInputProps {
  onSuccess?: () => void;
}
export function PrdInput({ onSuccess }: PrdInputProps) {
  const router = useRouter();
  const [prd, setPrd] = useState("");
  const [techStack, setTechStack] = useState("");
  const { setTree, setLoading, loading, error, setError } = useTreeStore();
  const handleGenerate = async () => {
    if (!prd.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const tree = await generateTreeFromPrd(prd, techStack || undefined);
      setTree(tree);
      onSuccess?.();
      router.push("/canvas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed. Check your Groq API key.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-5">
      {}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[11px] font-mono font-bold text-[rgba(255,255,255,0.35)] uppercase tracking-wider">
          <Browser size={14} className="text-[#3d8a6b]" />
          Project Blueprint / PRD
        </label>
        <textarea
          value={prd}
          onChange={(e) => setPrd(e.target.value)}
          placeholder="Describe your feature, system, or paste a full PRD..."
          rows={7}
          className="w-full rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0f0f0f] px-5 py-4 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[rgba(61,138,107,0.3)] focus:border-[rgba(61,138,107,0.4)] outline-none transition-all resize-none font-mono"
        />
      </div>
      {}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[11px] font-mono font-bold text-[rgba(255,255,255,0.35)] uppercase tracking-wider">
          <Code size={14} className="text-[#3d8a6b]" />
          Tech Stack <span className="text-[rgba(255,255,255,0.2)] normal-case font-normal not-italic">(optional)</span>
        </label>
        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="e.g. Next.js, Tailwind, Prisma, PostgreSQL"
          className="w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[rgba(61,138,107,0.3)] focus:border-[rgba(61,138,107,0.4)] outline-none transition-all"
        />
      </div>
      {}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <WarningCircle weight="bold" size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {}
      <button
        onClick={handleGenerate}
        disabled={!prd.trim() || loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]",
          "bg-[#3d8a6b] text-white shadow-[0_0_0_1px_rgba(61,138,107,0.4),0_8px_24px_rgba(61,138,107,0.2)]",
          "hover:bg-[#4a9f7e]",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {loading ? (
          <>
            <Sparkle className="animate-spin" size={16} />
            Generating architecture...
          </>
        ) : (
          <>
            <Lightning weight="fill" size={16} />
            Build Visual Canvas
          </>
        )}
      </button>
    </div>
  );
}
