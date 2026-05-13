import { jsonrepair } from "jsonrepair";
import type { TreeData, RepoAnalysis } from "@/types/tree";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
function getApiKey(): string {
  if (typeof window === "undefined") return "";
  const envKey = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GROQ_API_KEY : "";
  return localStorage.getItem("filytree-groq-key") ?? envKey ?? "";
}
const PRD_PROMPT = `You are a senior software architect. Convert the given PRD into a complete software architecture tree.
Include both folders AND individual files to represent the full proposed structure.
Return ONLY valid JSON with this exact structure:
{
  "nodes": [
    { "id": "src", "label": "src", "type": "folder", "children": ["app.tsx"], "reasoning": "Source root" },
    { "id": "app.tsx", "label": "app.tsx", "type": "file", "parent": "src", "children": [], "reasoning": "Main entry point" }
  ],
  "edges": [],
  "score": 85,
  "issues": []
}
Types: "folder", "file", "service", "ai-module", "api".
Keep "reasoning" to 1 sentence per node.`;
const REPO_PROMPT = `You are a senior software architect. Analyze this codebase structure and return a complete architecture tree.
You MUST include every single file and folder provided in the input structure. Do not skip files.
Return ONLY valid JSON with this exact structure:
{
  "nodes": [
    { "id": "src", "label": "src", "type": "folder", "children": ["index.ts"], "reasoning": "Source directory" },
    { "id": "index.ts", "label": "index.ts", "type": "file", "parent": "src", "children": [], "reasoning": "Main entry file" }
  ],
  "edges": [],
  "score": 75,
  "issues": [],
  "suggestions": []
}
Types: "folder", "file", "service", "ai-module", "api".
Include deep nesting detection, god folder detection, missing modular separation.`;
async function callGroq(prompt: string, system: string): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error("API key not found");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${res.statusText}${body ? ` - ${body.slice(0, 200)}` : ""}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}
function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*$/gm, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const repaired = jsonrepair(cleaned);
    return JSON.parse(repaired) as T;
  }
}
function cacheKey(type: string, input: string): string {
  const safe = input.slice(0, 200).replace(/[^\x00-\x7F]/g, "");
  return `filytree-cache-${type}-${btoa(safe)}`;
}
function getCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function setCache(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
  }
}
export async function generateTreeFromPrd(prd: string, techStack?: string): Promise<TreeData> {
  const key = cacheKey("prd", prd);
  const cached = getCache<TreeData>(key);
  if (cached) return cached;
  const prompt = techStack
    ? `Tech stack: ${techStack}\n\nPRD:\n${prd}`
    : `PRD:\n${prd}`;
  const raw = await callGroq(prompt, PRD_PROMPT);
  const data = parseJson<TreeData>(raw);
  setCache(key, data);
  return data;
}
export async function analyzeRepo(structure: string): Promise<RepoAnalysis> {
  const key = cacheKey("repo", structure);
  const cached = getCache<RepoAnalysis>(key);
  if (cached) return cached;
  const raw = await callGroq(`Repository structure:\n${structure}`, REPO_PROMPT);
  const parsed = parseJson<{
    nodes: RepoAnalysis["tree"]["nodes"];
    edges: RepoAnalysis["tree"]["edges"];
    score: number;
    issues: string[];
    suggestions: string[];
  }>(raw);
  const result: RepoAnalysis = {
    tree: { nodes: parsed.nodes ?? [], edges: parsed.edges ?? [] },
    score: parsed.score ?? 0,
    issues: parsed.issues ?? [],
    suggestions: parsed.suggestions ?? [],
  };
  setCache(key, result);
  return result;
}
export async function getNodeExplanation(nodeId: string, tree: TreeData): Promise<string> {
  const context = JSON.stringify(tree.nodes.find((n) => n.id === nodeId));
  const raw = await callGroq(
    `Explain this node in the architecture tree:\n${context}\n\nKeep it concise, 2-3 sentences.`,
    "You are a senior software architect explaining architecture decisions."
  );
  return raw;
}
