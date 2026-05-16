interface GitHubItem {
  name: string;
  path: string;
  type: "blob" | "tree";
  size?: number;
}
export async function fetchRepoTree(
  repoUrl: string,
  token?: string
): Promise<string> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\/|$)/);
  if (!match) throw new Error("Invalid GitHub URL");
  const [, owner, repo] = match;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
    { headers }
  );
  if (res.status === 404) {
    const masterRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
      { headers }
    );
    if (!masterRes.ok) throw new Error("Repository not found or access denied");
    const data = await masterRes.json();
    return formatTree(data.tree as GitHubItem[]);
  }
  if (!res.ok) {
    if (res.status === 403)
      throw new Error("Rate limit exceeded. Add a GitHub PAT.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data = await res.json();
  return formatTree(data.tree as GitHubItem[]);
}
function formatTree(items: GitHubItem[]): string {
  return items
    .map((item) => {
      const depth = item.path.split("/").length;
      const prefix =
        "  ".repeat(depth - 1) + (item.type === "tree" ? "[dir]" : "[file]");
      return `${prefix} ${item.path}`;
    })
    .join("\n");
}
