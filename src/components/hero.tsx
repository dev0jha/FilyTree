"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FramerCtaButton from "@/components/pixel-perfect/framer-cta-button";
import Svg1 from "@/components/pixel-perfect/svg-1";

import { useTreeStore } from "@/stores/tree-store";
import { useAppStore } from "@/stores/app-store";
import { generateTreeFromPrd } from "@/lib/groq";
import { fetchRepoTree } from "@/lib/github";
import { analyzeRepo } from "@/lib/groq";

export function HeroSection() {
  const [prd, setPrd] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setTree } = useTreeStore();
  const { setView } = useAppStore();

  async function handleLaunch() {
    if (!prd.trim() && !repoUrl.trim()) {
      setError("Enter a PRD or GitHub repo URL");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let data;
      if (prd.trim()) {
        data = await generateTreeFromPrd(prd);
      } else {
        const structure = await fetchRepoTree(repoUrl);
        const result = await analyzeRepo(structure);
        data = {
          nodes: result.tree.nodes,
          edges: result.tree.edges,
          score: result.score,
          issues: result.issues,
          title: repoUrl.split('/').filter(Boolean).pop() || "Codebase"
        };
      }
      setTree(data);
      setView("canvas");
      router.push("/canvas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="relative flex flex-col items-center justify-center px-4 py-12 md:px-4 md:py-24 lg:py-28">
        
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-1] size-full overflow-hidden"
        >
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5">
          <div className="fade-in animate-in fill-mode-backwards delay-0 duration-700 ease-out">
            <div className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-white/80 transition-all hover:border-white/20 hover:bg-white/10">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80"></span>
              </div>
              <span className="[text-shadow:_1px_0_oklch(0.7_0.2_20_/_0.3),_-1px_0_oklch(0.7_0.2_200_/_0.3)]">Fily<span className="text-emerald-500">Tree</span> AI</span>
            </div>
          </div>
          <h1
            className={cn(
              "max-w-2xl text-balance text-center text-3xl text-foreground md:text-5xl lg:text-6xl",
              "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out",
            )}
          >
            Visualize architecture from <span className="bg-linear-to-r from-blue-400 via-blue-500 to-blue-200 bg-clip-text text-transparent">PRDs</span> & <span className="bg-linear-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">repos</span>
          </h1>

          <p
            className={cn(
              "text-center text-muted-foreground text-sm tracking-wider sm:text-lg",
              "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out",
            )}
          >
            Drop a PRD or a GitHub repo — AI generates a full architecture{" "}
            <br /> tree with analysis, scoring, and insights.
          </p>

          <div className="relative w-full max-w-lg">
            <div className="absolute -left-16 -top-16 opacity-20 pointer-events-none z-0">
              <Svg1 />
            </div>
            <div className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-card p-6 shadow-sm z-10">
              <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
                Analyze your PRD or GitHub repository
              </p>
              <div className="flex flex-col gap-3">
                <textarea
                  placeholder="Paste your PRD here..."
                  value={prd}
                  onChange={(e) => setPrd(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground/50">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <input
                  type="text"
                  placeholder="GitHub repo URL (e.g. github.com/user/repo)"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <FramerCtaButton
                  variant="dark"
                  disabled={loading}
                  onClick={handleLaunch}
                  className="w-full"
                >
                  {loading ? "Analyzing..." : "Analyze & Visualize"}
                </FramerCtaButton>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center gap-2 fade-in animate-in fill-mode-backwards delay-500 duration-700 ease-out">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/30 text-center leading-relaxed">
              design and develop by <br />
              <span className="text-muted-foreground/60 font-bold tracking-[0.5em] ml-[0.5em]">DEV</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
