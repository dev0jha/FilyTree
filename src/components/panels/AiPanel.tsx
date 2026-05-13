"use client";
import { useEffect } from "react";
import { useTreeStore } from "@/stores/tree-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreeStructure,
  Lightning,
  Bug,
  ArrowsOut,
  Spinner,
} from "@phosphor-icons/react";
const NODE_TYPE_COLOR: Record<string, string> = {
  folder: "#3d8a6b",
  file: "#60a5fa",
  service: "#06b6d4",
  "ai-module": "#f59e0b",
  api: "#a855f7",
};
export function AiPanel() {
  const { tree, selectedNodeId, explanations, fetchExplanation } = useTreeStore();
  const selectedNode = tree?.nodes.find((n) => n.id === selectedNodeId);
  const explanation = selectedNodeId ? explanations.get(selectedNodeId) : undefined;
  const isFetchingExplanation = selectedNodeId && !explanation;
  useEffect(() => {
    if (selectedNodeId && !explanations.has(selectedNodeId)) {
      fetchExplanation(selectedNodeId);
    }
  }, [selectedNodeId, fetchExplanation, explanations]);
  return (
    <aside className="w-80 flex-shrink-0 flex flex-col overflow-hidden border-l border-[rgba(255,255,255,0.06)] bg-[#0f0f0f]">
      {}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <Lightning weight="fill" size={14} className="text-[#3d8a6b]" />
        <span className="text-xs font-mono font-bold text-[rgba(255,255,255,0.4)] uppercase tracking-widest">
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
              className="flex flex-col items-center justify-center h-full pt-16 gap-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
                <ArrowsOut size={18} className="text-[rgba(255,255,255,0.2)]" />
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.25)] max-w-[18ch] leading-relaxed">
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
                  className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0"
                  style={{
                    background: `${NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280"}18`,
                    border: `1px solid ${NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280"}30`,
                  }}
                >
                  <TreeStructure
                    size={14}
                    weight="bold"
                    style={{ color: NODE_TYPE_COLOR[selectedNode.type] ?? "#6b7280" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">{selectedNode.label}</p>
                  <span
                    className="mt-1 inline-block text-[10px] font-mono px-2 py-0.5 rounded-full"
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
                <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-3">
                  <p className="text-[10px] font-mono text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-2">
                    Reasoning
                  </p>
                  <p className="text-xs text-[rgba(255,255,255,0.6)] leading-relaxed">
                    {selectedNode.reasoning}
                  </p>
                </div>
              )}
              {}
              <div className="rounded-xl bg-[rgba(61,138,107,0.06)] border border-[rgba(61,138,107,0.15)] p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightning weight="fill" size={11} className="text-[#3d8a6b]" />
                  <p className="text-[10px] font-mono text-[#3d8a6b] uppercase tracking-widest">
                    AI Explanation
                  </p>
                </div>
                {isFetchingExplanation ? (
                  <div className="flex items-center gap-2">
                    <Spinner size={12} className="animate-spin text-[rgba(255,255,255,0.3)]" />
                    <span className="text-xs text-[rgba(255,255,255,0.3)]">Asking Groq...</span>
                  </div>
                ) : explanation ? (
                  <p className="text-xs text-[rgba(255,255,255,0.65)] leading-relaxed">
                    {explanation.summary}
                  </p>
                ) : (
                  <p className="text-xs text-[rgba(255,255,255,0.25)]">No explanation available.</p>
                )}
              </div>
              {}
              {selectedNode.issues && selectedNode.issues.length > 0 && (
                <div className="rounded-xl bg-red-500/8 border border-red-500/15 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bug weight="fill" size={11} className="text-red-400" />
                    <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                      Issues
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedNode.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-400">
                        <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {}
              {explanation?.improvements && explanation.improvements.length > 0 && (
                <div className="rounded-xl bg-[rgba(61,138,107,0.06)] border border-[rgba(61,138,107,0.15)] p-3">
                  <p className="text-[10px] font-mono text-[#3d8a6b] uppercase tracking-widest mb-2">
                    Suggestions
                  </p>
                  <ul className="space-y-1.5">
                    {explanation.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[rgba(255,255,255,0.5)]">
                        <span className="w-1 h-1 rounded-full bg-[#3d8a6b] mt-1.5 flex-shrink-0" />
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
