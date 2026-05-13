"use client";
import { useTreeStore } from "@/stores/tree-store";
import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { ArrowLeft, TreeStructure, Warning, CheckCircle, ArrowRight } from "@phosphor-icons/react";
function NodeTree({
  nodeId,
  nodes,
  depth,
}: {
  nodeId: string;
  nodes: { id: string; label: string; type: string; parent?: string }[];
  depth: number;
}) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;
  const children = nodes.filter((n) => n.parent === nodeId);
  return (
    <div>
      <div
        className="flex items-center gap-2 py-0.5 text-sm"
        style={{ paddingLeft: `${depth * 18}px` }}
      >
        <span
          className={`font-mono ${
            children.length
              ? "text-[rgba(255,255,255,0.75)]"
              : "text-[rgba(255,255,255,0.4)]"
          }`}
        >
          {node.label}
        </span>
        <span className="text-[10px] font-mono text-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">
          {node.type}
        </span>
      </div>
      {children.map((child) => (
        <NodeTree key={child.id} nodeId={child.id} nodes={nodes} depth={depth + 1} />
      ))}
    </div>
  );
}
export default function AnalysisPage() {
  const { tree } = useTreeStore();
  const { setView } = useAppStore();
  if (!tree) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[100dvh] bg-[#121212]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[rgba(255,255,255,0.07)] flex items-center justify-center mx-auto mb-4">
            <TreeStructure weight="bold" size={28} className="text-[rgba(255,255,255,0.2)]" />
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.4)] font-medium mb-3">
            No analysis data yet.
          </p>
          <Link
            href="/"
            onClick={() => setView("home")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3d8a6b] hover:text-[#4a9f7e] transition-colors"
          >
            <ArrowLeft weight="bold" size={14} />
            Analyze a repository
          </Link>
        </div>
      </div>
    );
  }
  const score = tree.score;
  const scoreColor =
    score === undefined
      ? "text-[rgba(255,255,255,0.4)]"
      : score >= 80
        ? "text-[#3d8a6b]"
        : score >= 50
          ? "text-amber-400"
          : "text-red-400";
  return (
    <main className="min-h-[100dvh] bg-[#121212] py-12 px-6">
      {}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-10">
        <Link
          href="/"
          onClick={() => setView("home")}
          className="flex items-center gap-2 text-sm font-medium text-[rgba(255,255,255,0.3)] hover:text-white transition-colors"
        >
          <ArrowLeft weight="bold" size={14} />
          Back
        </Link>
        <h1 className="text-sm font-mono font-bold text-[rgba(255,255,255,0.5)] uppercase tracking-widest">
          Architecture Analysis
        </h1>
        <Link
          href="/canvas"
          onClick={() => setView("canvas")}
          className="flex items-center gap-1.5 text-sm font-bold text-[#3d8a6b] hover:text-[#4a9f7e] transition-colors"
        >
          View on Canvas
          <ArrowRight weight="bold" size={14} />
        </Link>
      </div>
      <div className="max-w-3xl mx-auto space-y-5">
        {}
        {score !== undefined && (
          <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.07)] bg-[#181818] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-[10px] font-mono font-bold text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-3">
              Architecture Score
            </p>
            <div className="flex items-end gap-2">
              <span className={`text-6xl font-bold tracking-tighter ${scoreColor}`}>
                {score}
              </span>
              <span className="text-2xl text-[rgba(255,255,255,0.2)] mb-1">/100</span>
            </div>
            {}
            <div className="mt-4 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  score >= 80 ? "bg-[#3d8a6b]" : score >= 50 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )}
        {}
        {tree.issues && tree.issues.length > 0 && (
          <div className="rounded-[1.5rem] border border-red-500/15 bg-red-500/5 p-8">
            <div className="flex items-center gap-2 mb-4">
              <Warning weight="fill" size={14} className="text-red-400" />
              <p className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                Issues Detected
              </p>
            </div>
            <ul className="space-y-2.5">
              {tree.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[rgba(255,255,255,0.55)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        {}
        <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.07)] bg-[#181818] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <TreeStructure weight="bold" size={14} className="text-[rgba(255,255,255,0.4)]" />
            <p className="text-[10px] font-mono font-bold text-[rgba(255,255,255,0.3)] uppercase tracking-widest">
              Project Structure
            </p>
          </div>
          <div className="space-y-0.5">
            {tree.nodes
              .filter((n) => !n.parent)
              .map((node) => (
                <NodeTree key={node.id} nodeId={node.id} nodes={tree.nodes} depth={0} />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
