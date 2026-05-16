import JSZip from "jszip";

interface ZipEntry {
  path: string;
  type: "file" | "folder";
}
export async function extractZip(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(file);
  const entries: ZipEntry[] = [];
  zip.forEach((relativePath, zipEntry) => {
    if (relativePath.startsWith("__MACOSX") || relativePath.startsWith("."))
      return;
    entries.push({
      path: relativePath,
      type: zipEntry.dir ? "folder" : "file",
    });
  });
  return entries
    .map((e) => {
      const depth = e.path.split("/").length;
      const prefix =
        "  ".repeat(depth - 1) + (e.type === "folder" ? "[dir]" : "[file]");
      return `${prefix} ${e.path}`;
    })
    .join("\n");
}
