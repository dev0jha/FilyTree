"use client";
import { useTreeStore } from "@/stores/tree-store";
import { getColorByPath } from "@/lib/tree";
import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import {
  FolderOpen,
  Folder,
  FileTs,
  Cpu,
  Globe,
  Atom,
  CaretRight,
  CaretDown,
  ArrowsOut,
  ArrowsIn,
  ArrowLeft,
} from "@phosphor-icons/react";
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
    <aside className="w-60 flex-shrink-0 flex flex-col overflow-hidden bg-[oklch(21%_0.006_285.885)] border-r border-[rgba(255,255,255,0.08)]">
      {}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-mono font-bold text-[rgba(255,255,255,0.3)] uppercase tracking-widest">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            title="Expand all"
            className="p-1 rounded text-[rgba(255,255,255,0.25)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
          >
            <ArrowsOut size={13} />
          </button>
          <button
            onClick={collapseAll}
            title="Collapse all"
            className="p-1 rounded text-[rgba(255,255,255,0.25)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
          >
            <ArrowsIn size={13} />
          </button>
        </div>
      </div>
      {}
      <div className="flex-1 overflow-y-auto py-2">
        {!tree ? (
          <p className="text-xs text-[rgba(255,255,255,0.2)] px-4 py-3">No tree loaded</p>
        ) : topLevel.length === 0 ? (
          <p className="text-xs text-[rgba(255,255,255,0.2)] px-4 py-3">Empty tree</p>
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
          <span className="text-[10px] font-mono text-[rgba(255,255,255,0.2)]">
            {tree.nodes.length} nodes
          </span>
        </div>
      )}
      <Link
        href="/"
        onClick={() => setView("home")}
        className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-[rgba(255,255,255,0.3)] hover:text-[#3d8a6b] transition-colors"
      >
        <ArrowLeft weight="bold" size={14} />
        Back
      </Link>
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
        className={`
          flex items-center gap-1.5 rounded-lg py-1 pr-2 cursor-pointer transition-all text-xs
          ${isSelected
            ? "bg-[rgba(61,138,107,0.2)] text-white backdrop-blur-sm"
            : "text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
          }
        `}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {}
        <span className="w-3 flex-shrink-0 text-[rgba(255,255,255,0.25)]">
          {isFolder && children.length > 0 ? (
            isExpanded ? <CaretDown size={9} weight="bold" /> : <CaretRight size={9} weight="bold" />
          ) : null}
        </span>
        {}
        <Icon
          size={12}
          weight="fill"
          style={{ color, flexShrink: 0 }}
        />
        {}
        <span className="truncate flex-1">{node.label}</span>
        {}
        {hasIssues && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
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
              className="text-[10px] text-[rgba(255,255,255,0.15)] py-0.5 italic"
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
