"use client";
import Link from "next/link";

import { ArrowLeft, TreeStructure } from "@phosphor-icons/react";

import { Canvas } from "@/components/canvas/Canvas";
import { AiPanel } from "@/components/panels/AiPanel";
import { Sidebar } from "@/components/panels/Sidebar";
import { useAppStore } from "@/stores/app-store";
import { useTreeStore } from "@/stores/tree-store";

export default function CanvasPage() {
  const { tree } = useTreeStore();
  const { setView } = useAppStore();
  if (!tree) {
    return (
      <div className="flex min-h-[100dvh] flex-1 items-center justify-center bg-[oklch(21%_0.006_285.885)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1a1a1a]">
            <TreeStructure
              weight="bold"
              size={28}
              className="text-[rgba(255,255,255,0.2)]"
            />
          </div>
          <p className="mb-3 text-sm font-medium text-[rgba(255,255,255,0.4)]">
            No architecture loaded.
          </p>
          <Link
            href="/"
            onClick={() => setView("home")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3d8a6b] transition-colors hover:text-[#4a9f7e]"
          >
            <ArrowLeft weight="bold" size={14} />
            Generate one from your PRD
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-[100dvh] bg-[oklch(21%_0.006_285.885)]">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <Canvas />
      </div>
      <AiPanel />
    </div>
  );
}
