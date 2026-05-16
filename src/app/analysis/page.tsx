"use client";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  TreeStructure,
  Warning,
} from "@phosphor-icons/react";

import { useAppStore } from "@/stores/app-store";
import { useTreeStore } from "@/stores/tree-store";

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
        <span className="rounded bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 font-mono text-[10px] text-[rgba(255,255,255,0.2)]">
          {node.type}
        </span>
      </div>
      {children.map((child) => (
        <NodeTree
          key={child.id}
          nodeId={child.id}
          nodes={nodes}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
export default function AnalysisPage() {
  const { tree } = useTreeStore();
  const { setView } = useAppStore();
  if (!tree) {
    return (
      <div className="flex min-h-[100dvh] flex-1 items-center justify-center bg-[#121212]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1a1a1a]">
            <TreeStructure
              weight="bold"
              size={28}
              className="text-[rgba(255,255,255,0.2)]"
            />
          </div>
          <p className="mb-3 text-sm font-medium text-[rgba(255,255,255,0.4)]">
            No analysis data yet.
          </p>
          <Link
            href="/"
            onClick={() => setView("home")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3d8a6b] transition-colors hover:text-[#4a9f7e]"
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
    <main className="min-h-[100dvh] bg-[#121212] px-6 py-12">
      {}
      <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between">
        <Link
          href="/"
          onClick={() => setView("home")}
          className="flex items-center gap-2 text-sm font-medium text-[rgba(255,255,255,0.3)] transition-colors hover:text-white"
        >
          <ArrowLeft weight="bold" size={14} />
          Back
        </Link>
        <h1 className="font-mono text-sm font-bold tracking-widest text-[rgba(255,255,255,0.5)] uppercase">
          Architecture Analysis
        </h1>
        <Link
          href="/canvas"
          onClick={() => setView("canvas")}
          className="flex items-center gap-1.5 text-sm font-bold text-[#3d8a6b] transition-colors hover:text-[#4a9f7e]"
        >
          View on Canvas
          <ArrowRight weight="bold" size={14} />
        </Link>
      </div>
      <div className="mx-auto max-w-3xl space-y-5">
        {}
        {score !== undefined && (
          <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.07)] bg-[#181818] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="mb-3 font-mono text-[10px] font-bold tracking-widest text-[rgba(255,255,255,0.3)] uppercase">
              Architecture Score
            </p>
            <div className="flex items-end gap-2">
              <span
                className={`text-6xl font-bold tracking-tighter ${scoreColor}`}
              >
                {score}
              </span>
              <span className="mb-1 text-2xl text-[rgba(255,255,255,0.2)]">
                /100
              </span>
            </div>
            {}
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
              <div
                className={`h-full rounded-full transition-all ${
                  score >= 80
                    ? "bg-[#3d8a6b]"
                    : score >= 50
                      ? "bg-amber-400"
                      : "bg-red-400"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )}
        {}
        {tree.issues && tree.issues.length > 0 && (
          <div className="rounded-[1.5rem] border border-red-500/15 bg-red-500/5 p-8">
            <div className="mb-4 flex items-center gap-2">
              <Warning weight="fill" size={14} className="text-red-400" />
              <p className="font-mono text-[10px] font-bold tracking-widest text-red-400 uppercase">
                Issues Detected
              </p>
            </div>
            <ul className="space-y-2.5">
              {tree.issues.map((issue, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[rgba(255,255,255,0.55)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        {}
        <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.07)] bg-[#181818] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="mb-4 flex items-center gap-2">
            <TreeStructure
              weight="bold"
              size={14}
              className="text-[rgba(255,255,255,0.4)]"
            />
            <p className="font-mono text-[10px] font-bold tracking-widest text-[rgba(255,255,255,0.3)] uppercase">
              Project Structure
            </p>
          </div>
          <div className="space-y-0.5">
            {tree.nodes
              .filter((n) => !n.parent)
              .map((node) => (
                <NodeTree
                  key={node.id}
                  nodeId={node.id}
                  nodes={tree.nodes}
                  depth={0}
                />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
