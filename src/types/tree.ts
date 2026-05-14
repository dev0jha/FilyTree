export type NodeType = "folder" | "file" | "service" | "ai-module" | "api";
export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  parent?: string;
  children: string[];
  reasoning?: string;
  issues?: string[];
  path?: string;
}
export interface TreeEdge {
  from: string;
  to: string;
}
export interface TreeData {
  nodes: TreeNode[];
  edges: TreeEdge[];
  score?: number;
  issues?: string[];
  title?: string;
}
export interface AiExplanation {
  nodeId: string;
  summary: string;
  improvements?: string[];
  issues?: string[];
}
export interface RepoAnalysis {
  tree: TreeData;
  score: number;
  issues: string[];
  suggestions: string[];
}
