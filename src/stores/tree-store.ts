"use client";
import { create } from "zustand";

import { getNodeExplanation } from "@/lib/groq";
import type { AiExplanation, TreeData } from "@/types/tree";

interface TreeState {
  tree: TreeData | null;
  loading: boolean;
  error: string | null;
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
  explanations: Map<string, AiExplanation>;
  viewport: { x: number; y: number; zoom: number };
  setTree: (tree: TreeData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectNode: (nodeId: string | null) => void;
  toggleNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setViewport: (vp: { x: number; y: number; zoom: number }) => void;
  fetchExplanation: (nodeId: string) => Promise<void>;
}
export const useTreeStore = create<TreeState>((set, get) => ({
  tree: null,
  loading: false,
  error: null,
  selectedNodeId: null,
  expandedNodes: new Set<string>(),
  explanations: new Map<string, AiExplanation>(),
  viewport: { x: 0, y: 0, zoom: 1 },
  setTree: (tree) => {
    if (!tree || !tree.nodes) {
      return set({ error: "Invalid tree data received from API." });
    }
    return set({
      tree,
      expandedNodes: new Set(
        tree.nodes.filter((n) => !n.parent).map((n) => n.id)
      ),
      explanations: new Map(),
      selectedNodeId: null,
      error: null,
    });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  toggleNode: (nodeId) =>
    set((state) => {
      const next = new Set(state.expandedNodes);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return { expandedNodes: next };
    }),
  expandAll: () =>
    set((state) => {
      if (!state.tree) return {};
      return { expandedNodes: new Set(state.tree.nodes.map((n) => n.id)) };
    }),
  collapseAll: () => set({ expandedNodes: new Set() }),
  setViewport: (viewport) => set({ viewport }),
  fetchExplanation: async (nodeId) => {
    const state = get();
    if (state.explanations.has(nodeId)) return;
    if (!state.tree) return;
    try {
      const raw = await getNodeExplanation(nodeId, state.tree);
      set((s) => {
        const next = new Map(s.explanations);
        next.set(nodeId, { nodeId, summary: raw });
        return { explanations: next };
      });
    } catch {}
  },
}));
