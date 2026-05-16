"use client";
import Link from "next/link";

import {
  ArrowLeft,
  Atom,
  CaretDown,
  CaretRight,
  Cpu,
  FileTs,
  Folder,
  FolderOpen,
  Globe,
} from "@phosphor-icons/react";

import { getColorByPath } from "@/lib/tree";
import { useAppStore } from "@/stores/app-store";
import { useTreeStore } from "@/stores/tree-store";

const NODE_ICON: Record<string, React.ElementType> = {
  folder: FolderOpen,
  file: FileTs,
  service: Atom,
  "ai-module": Cpu,
  api: Globe,
};
export function Sidebar() {
  const {
    tree,
    selectedNodeId,
    selectNode,
    toggleNode,
    expandedNodes,
    collapseAll,
    expandAll,
  } = useTreeStore();
  const { setView } = useAppStore();
  const topLevel = tree?.nodes.filter((n) => !n.parent) ?? [];
  return (
    <aside className="flex w-60 flex-shrink-0 flex-col overflow-hidden border-r border-[rgba(255,255,255,0.08)] bg-[oklch(21%_0.006_285.885)]">
      {}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-[10px] font-bold tracking-widest text-[rgba(255,255,255,0.3)] uppercase">
          Explorer
        </span>
        <Link
          href="/"
          onClick={() => setView("home")}
          className="flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-[rgba(255,255,255,0.4)] uppercase transition-all hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
        >
          <ArrowLeft weight="bold" size={11} />
          Back
        </Link>
      </div>
      {}
      <div className="flex-1 overflow-y-auto py-2">
        {!tree ? (
          <p className="px-4 py-3 text-xs text-[rgba(255,255,255,0.2)]">
            No tree loaded
          </p>
        ) : topLevel.length === 0 ? (
          <p className="px-4 py-3 text-xs text-[rgba(255,255,255,0.2)]">
            Empty tree
          </p>
        ) : (
          topLevel.map((node) => (
            <TreeNodeItem
              key={node.id}
              nodeId={node.id}
              selectedNodeId={selectedNodeId}
              onSelect={selectNode}
              onToggle={toggleNode}
              expandedNodes={expandedNodes}
              nodes={tree.nodes}
              depth={0}
            />
          ))
        )}
      </div>
      {}
      {tree && (
        <div className="px-4 py-2">
          <span className="font-mono text-[10px] text-[rgba(255,255,255,0.2)]">
            {tree.nodes.length} nodes
          </span>
        </div>
      )}
    </aside>
  );
}
function TreeNodeItem({
  nodeId,
  selectedNodeId,
  onSelect,
  onToggle,
  expandedNodes,
  nodes,
  depth = 0,
}: {
  nodeId: string;
  selectedNodeId: string | null;
  onSelect: (id: string | null) => void;
  onToggle: (id: string) => void;
  expandedNodes: Set<string>;
  nodes: {
    id: string;
    label: string;
    type: string;
    children: string[];
    parent?: string;
    path?: string;
    issues?: string[];
  }[];
  depth?: number;
}) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;
  const isFolder = node.type === "folder";
  const isExpanded = expandedNodes.has(nodeId);
  const isSelected = selectedNodeId === nodeId;
  const children = nodes.filter((n) => n.parent === nodeId);
  const hasIssues = node.issues && node.issues.length > 0;
  const color = hasIssues ? "#ef4444" : getColorByPath(node.path, node.type);
  const Icon = NODE_ICON[node.type] ?? Folder;
  return (
    <div>
      <div
        onClick={() => {
          onSelect(nodeId);
          if (isFolder && children.length > 0) onToggle(nodeId);
        }}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg py-1 pr-2 text-xs transition-all ${
          isSelected
            ? "bg-[rgba(61,138,107,0.2)] text-white backdrop-blur-sm"
            : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
        } `}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {}
        <span className="w-3 flex-shrink-0 text-[rgba(255,255,255,0.25)]">
          {isFolder && children.length > 0 ? (
            isExpanded ? (
              <CaretDown size={9} weight="bold" />
            ) : (
              <CaretRight size={9} weight="bold" />
            )
          ) : null}
        </span>
        {}
        <Icon size={12} weight="fill" style={{ color, flexShrink: 0 }} />
        {}
        <span className="flex-1 truncate">{node.label}</span>
        {}
        {hasIssues && (
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
        )}
      </div>
      {}
      {isFolder && isExpanded && (
        <div>
          {children.map((child) => (
            <TreeNodeItem
              key={child.id}
              nodeId={child.id}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
              nodes={nodes}
              depth={depth + 1}
            />
          ))}
          {children.length === 0 && (
            <div
              className="py-0.5 text-[10px] text-[rgba(255,255,255,0.15)] italic"
              style={{ paddingLeft: `${20 + depth * 12}px` }}
            >
              empty
            </div>
          )}
        </div>
      )}
    </div>
  );
}
