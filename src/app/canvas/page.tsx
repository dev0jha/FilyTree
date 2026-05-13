"use client";
import { useTreeStore } from "@/stores/tree-store";
import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { Canvas } from "@/components/canvas/Canvas";
import { Sidebar } from "@/components/panels/Sidebar";
import { AiPanel } from "@/components/panels/AiPanel";
import { TreeStructure, ArrowLeft } from "@phosphor-icons/react";
export default function CanvasPage() {
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
            No architecture loaded.
          </p>
          <Link
            href="/"
            onClick={() => setView("home")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3d8a6b] hover:text-[#4a9f7e] transition-colors"
          >
            <ArrowLeft weight="bold" size={14} />
            Generate one from your PRD
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-[100dvh] bg-[#121212]">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <Canvas />
      </div>
      <AiPanel />
    </div>
  );
}
