"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTreeStore } from "@/stores/tree-store";
import { fetchRepoTree } from "@/lib/github";
import { extractZip } from "@/lib/zip";
import { analyzeRepo } from "@/lib/groq"; 
import {
  GithubLogo,
  UploadSimple,
  Shield,
  Sparkle,
  MagnifyingGlass,
  WarningCircle,
  CloudArrowUp,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
interface RepoInputProps {
  onSuccess?: () => void;
}
export function RepoInput({ onSuccess }: RepoInputProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pat, setPat] = useState("");
  const [mode, setMode] = useState<"github" | "upload">("github");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { setTree, setLoading, loading, error, setError } = useTreeStore();
  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const structure = await fetchRepoTree(url, pat || undefined);
      const analysis = await analyzeRepo(structure);
      setTree(analysis.tree);
      onSuccess?.();
      router.push("/analysis");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Check your Groq API key.");
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setError(null);
    try {
      const structure = await extractZip(file);
      const analysis = await analyzeRepo(structure);
      setTree(analysis.tree);
      onSuccess?.();
      router.push("/analysis");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed. Ensure it is a valid ZIP.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-5">
      {}
      <div className="flex p-1 bg-[#0f0f0f] rounded-2xl border border-[rgba(255,255,255,0.06)]">
        {(["github", "upload"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl",
              mode === m
                ? "bg-[#1e1e1e] text-white border border-[rgba(255,255,255,0.08)] shadow-sm"
                : "text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)]"
            )}
          >
            {m === "github" ? <GithubLogo size={14} /> : <UploadSimple size={14} />}
            {m === "github" ? "GitHub URL" : "Upload ZIP"}
          </button>
        ))}
      </div>
      {}
      {mode === "github" && (
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.25)]">
              <MagnifyingGlass weight="bold" size={16} />
            </div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0f0f0f] pl-11 pr-5 py-3.5 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[rgba(96,165,250,0.3)] focus:border-[rgba(96,165,250,0.4)] outline-none transition-all"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.25)]">
              <Shield weight="bold" size={16} />
            </div>
            <input
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="GitHub PAT — optional, for private repos"
              type="password"
              className="w-full rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0f0f0f] pl-11 pr-5 py-3.5 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[rgba(61,138,107,0.3)] focus:border-[rgba(61,138,107,0.4)] outline-none transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || loading}
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
                Analyzing repository...
              </>
            ) : (
              <>
                <GithubLogo weight="fill" size={16} />
                Analyze Repository
              </>
            )}
          </button>
        </div>
      )}
      {}
      {mode === "upload" && (
        <div
          onClick={() => !loading && fileRef.current?.click()}
          className={cn(
            "group cursor-pointer border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 transition-all",
            loading
              ? "border-[rgba(61,138,107,0.3)] bg-[rgba(61,138,107,0.05)]"
              : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(61,138,107,0.4)] hover:bg-[rgba(61,138,107,0.04)]"
          )}
        >
          <input
            type="file"
            ref={fileRef}
            onChange={handleUpload}
            accept=".zip"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(255,255,255,0.3)] group-hover:text-[#3d8a6b] group-hover:border-[rgba(61,138,107,0.3)] transition-all">
            {loading ? (
              <Sparkle className="animate-spin" size={28} />
            ) : (
              <CloudArrowUp size={28} weight="bold" />
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-white text-sm">
              {fileName ? fileName : loading ? "Analyzing..." : "Drop your project ZIP"}
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">Max 50MB · .zip only</p>
          </div>
        </div>
      )}
      {}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <WarningCircle weight="bold" size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
