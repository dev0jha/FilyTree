"use client";
import { useEffect } from "react";

import {
  ArrowsOut,
  Bug,
  Lightning,
  Spinner,
  TreeStructure,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

import { useTreeStore } from "@/stores/tree-store";

const NODE_TYPE_COLOR: Record<string, string> = {
  folder: "#3d8a6b",
  file: "#60a5fa",
  service: "#06b6d4",
  "ai-module": "#f59e0b",
  api: "#a855f7",
};
export function AiPanel() {
  const { tree, selectedNodeId, explanations, fetchExplanation } =
    useTreeStore();
  const selectedNode = tree?.nodes.find((n) => n.id === selectedNodeId);
  const explanation = selectedNodeId
    ? explanations.get(selectedNodeId)
    : undefined;
  const isFetchingExplanation = selectedNodeId && !explanation;
  useEffect(() => {
    if (selectedNodeId && !explanations.has(selectedNodeId)) {
      fetchExplanation(selectedNodeId);
    }
  }, [selectedNodeId, fetchExplanation, explanations]);
  return (
    <aside className="flex w-80 flex-shrink-0 flex-col overflow-hidden border-l border-[rgba(255,255,255,0.08)] bg-[oklch(21%_0.006_285.885)]">
      {}
      <div className="flex items-center gap-2 px-4 py-3">
        <Lightning weight="fill" size={14} className="text-[#3d8a6b]" />
        <span className="font-mono text-xs font-bold tracking-widest text-[rgba(255,255,255,0.4)] uppercase">
          AI Inspector
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {!selectedNode ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center gap-4 pt-16 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]">
                <ArrowsOut size={18} className="text-[rgba(255,255,255,0.2)]" />
              </div>
              <p className="max-w-[18ch] text-xs leading-relaxed text-[rgba(255,255,255,0.25)]">
                Click any node on the canvas to inspect it with AI
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedNodeId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
              className="space-y-5"
            >
              {}
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `${NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280"}18`,
                    border: `1px solid ${NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280"}30`,
                  }}
                >
                  <TreeStructure
                    size={14}
                    weight="bold"
                    style={{
                      color: NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280",
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight text-white">
                    {selectedNode.label}
                  </p>
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10px]"
                    style={{
                      background: `${NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280"}18`,
                      color: NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280",
                    }}
                  >
                    {selectedNode.type}
                  </span>
                </div>
              </div>
              {}
              {selectedNode.reasoning && (
                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                  <p className="mb-2 font-mono text-[10px] tracking-widest text-[rgba(255,255,255,0.3)] uppercase">
                    Reasoning
                  </p>
                  <p className="text-xs leading-relaxed text-[rgba(255,255,255,0.6)]">
                    {selectedNode.reasoning}
                  </p>
                </div>
              )}
              {}
              <div className="rounded-xl border border-[rgba(61,138,107,0.15)] bg-[rgba(61,138,107,0.06)] p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <Lightning
                    weight="fill"
                    size={11}
                    className="text-[#3d8a6b]"
                  />
                  <p className="font-mono text-[10px] tracking-widest text-[#3d8a6b] uppercase">
                    AI Explanation
                  </p>
                </div>
                {isFetchingExplanation ? (
                  <div className="flex items-center gap-2">
                    <Spinner
                      size={12}
                      className="animate-spin text-[rgba(255,255,255,0.3)]"
                    />
                    <span className="text-xs text-[rgba(255,255,255,0.3)]">
                      Asking Groq...
                    </span>
                  </div>
                ) : explanation ? (
                  <p className="text-xs leading-relaxed text-[rgba(255,255,255,0.65)]">
                    {explanation.summary}
                  </p>
                ) : (
                  <p className="text-xs text-[rgba(255,255,255,0.25)]">
                    No explanation available.
                  </p>
                )}
              </div>
              {}
              {selectedNode.issues && selectedNode.issues.length > 0 && (
                <div className="rounded-xl border border-red-500/15 bg-red-500/8 p-3">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Bug weight="fill" size={11} className="text-red-400" />
                    <p className="font-mono text-[10px] tracking-widest text-red-400 uppercase">
                      Issues
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedNode.issues.map((issue, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-red-400"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-red-400" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {}
              {explanation?.improvements &&
                explanation.improvements.length > 0 && (
                  <div className="rounded-xl border border-[rgba(61,138,107,0.15)] bg-[rgba(61,138,107,0.06)] p-3">
                    <p className="mb-2 font-mono text-[10px] tracking-widest text-[#3d8a6b] uppercase">
                      Suggestions
                    </p>
                    <ul className="space-y-1.5">
                      {explanation.improvements.map((imp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-[rgba(255,255,255,0.5)]"
                        >
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#3d8a6b]" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
