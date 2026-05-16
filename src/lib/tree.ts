import type { TreeData, TreeNode } from "@/types/tree";

export function getSubtree(data: TreeData, nodeId: string): TreeData {
  const node = data.nodes.find((n) => n.id === nodeId);
  if (!node) return { nodes: [], edges: [] };
  const ids = new Set<string>();
  const queue = [nodeId];
  while (queue.length) {
    const id = queue.shift()!;
    if (ids.has(id)) continue;
    ids.add(id);
    const current = data.nodes.find((n) => n.id === id);
    if (current) queue.push(...current.children);
  }
  return {
    nodes: data.nodes.filter((n) => ids.has(n.id)),
    edges: data.edges.filter((e) => ids.has(e.from) && ids.has(e.to)),
  };
}
export function moveNode(
  data: TreeData,
  nodeId: string,
  newParent: string
): TreeData {
  const node = data.nodes.find((n) => n.id === nodeId);
  const oldParent = data.nodes.find((n) => n.id === node?.parent);
  const target = data.nodes.find((n) => n.id === newParent);
  if (!node || !target) return data;
  const nodes = data.nodes.map((n) => ({ ...n }));
  const edges = data.edges.filter(
    (e) => e.from !== node.parent && e.to !== nodeId
  );
  const updatedNode = nodes.find((n) => n.id === nodeId);
  if (updatedNode) updatedNode.parent = newParent;
  if (oldParent) {
    oldParent.children = oldParent.children.filter((c) => c !== nodeId);
  }
  target.children = [...target.children, nodeId];
  edges.push({ from: newParent, to: nodeId });
  return { ...data, nodes, edges };
}
export function flattenTree(nodes: TreeNode[]): string[] {
  const result: string[] = [];
  function walk(parentId?: string, depth = 0) {
    const children = nodes.filter((n) => n.parent === parentId);
    for (const child of children) {
      result.push(child.id);
      walk(child.id, depth + 1);
    }
  }
  walk();
  return result;
}
export function getColorByPath(path: string | undefined, type: string): string {
  if (!path) return "#3b82f6";
  if (path.startsWith("frontend") || path.includes("frontend"))
    return "#3b82f6";
  if (path.startsWith("backend") || path.includes("backend")) return "#22c55e";
  if (path.includes("ai") || path.includes("ai-module")) return "#eab308";
  if (type === "api") return "#a855f7";
  if (type === "service") return "#06b6d4";
  return "#6b7280";
}
