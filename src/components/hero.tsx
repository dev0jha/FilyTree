"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FramerCtaButton from "@/components/pixel-perfect/framer-cta-button";
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
				data = { nodes: result.tree.nodes, edges: result.tree.edges, score: result.score, issues: result.issues };
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
					<div
						className={cn(
							"absolute -inset-x-20 inset-y-0 z-0 rounded-full",
							"bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
							"blur-[50px]"
						)}
					/>
					<div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
					<div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
					<div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
					<div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
				</div>
				<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5">
					<p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
						FilyTree
					</p>
					<h1
						className={cn(
							"max-w-2xl text-balance text-center text-3xl text-foreground md:text-5xl lg:text-6xl",
							"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out"
						)}
					>
						Visualize architecture from PRDs & repos
					</h1>

					<p
						className={cn(
							"text-center text-muted-foreground text-sm tracking-wider sm:text-lg",
							"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out"
						)}
					>
Drop a PRD or a GitHub repo — AI generates a full architecture <br /> tree with analysis, scoring, and insights.
					</p>

					<div className="w-full max-w-lg rounded-2xl border border-[rgba(255,255,255,0.07)] bg-card p-6 shadow-sm">
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
							{error && (
								<p className="text-xs text-red-400">{error}</p>
							)}
							<FramerCtaButton
								variant="dark"
								disabled={loading}
								onClick={handleLaunch}
								className="w-full"
							>
								{loading ? "Analyzing..." : "Launch Canvas"}
							</FramerCtaButton>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
