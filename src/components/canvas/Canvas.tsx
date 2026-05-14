"use client";
import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { useTreeStore } from "@/stores/tree-store";
import { getColorByPath } from "@/lib/tree";
import {
  FolderOpen,
  FileTs,
  Cpu,
  Globe,
  Atom,
  Warning,
  GithubLogo,
} from "@phosphor-icons/react";
import { renderToStaticMarkup } from "react-dom/server";
interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
  depth: number;
  parent?: string;
  children: string[];
  reasoning?: string;
  issues?: string[];
  path?: string;
  x: number;
  y: number;
}
const ICON_MAP: Record<string, any> = {
  folder: FolderOpen,
  file: FileTs,
  service: Atom,
  "ai-module": Cpu,
  api: Globe,
};
export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tree, expandedNodes, viewport, setViewport, selectNode, selectedNodeId } =
    useTreeStore();
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  const render = useCallback(() => {
    if (!svgRef.current || !tree) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;
    svg.selectAll("*").remove();
    const g = svg.append("g");
    const visibleNodes = tree.nodes.filter(
      (n) => !n.parent || expandedNodes.has(n.parent)
    );
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    let d3Nodes: D3Node[] = visibleNodes
      .filter((n) => !n.parent || visibleIds.has(n.parent))
      .map((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        depth: n.parent ? 1 : 0,
        parent: n.parent,
        children: n.children,
        reasoning: n.reasoning,
        issues: n.issues,
        path: n.path,
        x: 0,
        y: 0,
      }));
    if (d3Nodes.length === 0) return;
    const roots = d3Nodes.filter((n) => !n.parent);
    if (roots.length > 1) {
      d3Nodes = [
        {
          id: "__root__",
          label: "project",
          type: "folder",
          depth: 0,
          children: roots.map((r) => r.id),
          x: 0,
          y: 0,
        },
        ...d3Nodes.map((n) =>
          !n.parent ? { ...n, parent: "__root__", depth: 1 } : n
        ),
      ];
    }
    let root: d3.HierarchyPointNode<D3Node>;
    try {
      const stratified = d3
        .stratify<D3Node>()
        .id((d) => d.id)
        .parentId((d) => d.parent)(d3Nodes);
      root = d3.tree<D3Node>().size([width - 200, height - 200])(stratified);
    } catch (err) {
      console.error("[Canvas] layout error:", err);
      return;
    }
    const gEl = g.attr("transform", "translate(100, 100)");
    const linkGroup = gEl.append("g")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.08)")
      .attr("stroke-width", 1.5);
    const updateLinks = () => {
      linkGroup.selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", (d: any) => {
          const sx = d.source.x, sy = d.source.y;
          const tx = d.target.x, ty = d.target.y;
          const midY = (sy + ty) / 2;
          return `M${sx},${sy}C${sx},${midY} ${tx},${midY} ${tx},${ty}`;
        });
    };
    updateLinks();
    const nodeGroup = gEl
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .filter((d) => d.data.id !== "__root__")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "grab")
      .on("click", (event, d) => {
        event.stopPropagation();
        selectNode(d.data.id);
      });
    const drag = d3.drag<SVGGElement, d3.HierarchyPointNode<D3Node>>()
      .on("start", function() {
        d3.select(this).style("cursor", "grabbing");
      })
      .on("drag", function(event, d) {
        const dx = event.dx;
        const dy = event.dy;
        const move = (node: any) => {
          node.x += dx;
          node.y += dy;
          if (node.children) {
            node.children.forEach(move);
          }
        };
        move(d);
        nodeGroup.attr("transform", (nd: any) => `translate(${nd.x},${nd.y})`);
        updateLinks();
      })
      .on("end", function() {
        d3.select(this).style("cursor", "grab");
      });
    nodeGroup.call(drag as any);
    const radius = (d: d3.HierarchyPointNode<D3Node>) =>
      d.data.type === "folder" ? 20 : 16;
    nodeGroup
      .filter((d) => d.data.id === selectedNodeId)
      .append("circle")
      .attr("r", (d) => radius(d) + 8)
      .attr("fill", "none")
      .attr("stroke", "rgba(61,138,107,0.3)")
      .attr("stroke-width", 2)
      .attr("class", "glow-ring");
    nodeGroup
      .append("circle")
      .attr("r", radius)
      .attr("fill", "rgba(26,26,26,0.7)")
      .attr("stroke", (d) => {
        if (d.data.issues?.length) return "#ef4444";
        return d.data.id === selectedNodeId ? "#3d8a6b" : "rgba(255,255,255,0.12)";
      })
      .attr("stroke-width", 2)
      .attr("class", "node-base");
    nodeGroup.append("foreignObject")
      .attr("x", (d) => -radius(d) / 2 - 2)
      .attr("y", (d) => -radius(d) / 2 - 2)
      .attr("width", (d) => radius(d) + 4)
      .attr("height", (d) => radius(d) + 4)
      .append("xhtml:div")
      .style("color", (d) => {
        if (d.data.issues?.length) return "#ef4444";
        return getColorByPath(d.data.path, d.data.type);
      })
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("width", "100%")
      .style("height", "100%")
      .style("pointer-events", "none")
      .html((d) => {
        const Icon = ICON_MAP[d.data.type] || FileTs;
        return renderToStaticMarkup(<Icon size={radius(d) - 6} weight="fill" />);
      });
    nodeGroup
      .filter((d) => !!(d.data.issues?.length))
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d) => radius(d) - 3)
      .attr("cy", (d) => -(radius(d) - 3))
      .attr("fill", "#ef4444")
      .attr("stroke", "#121212")
      .attr("stroke-width", 1.5);
    nodeGroup
      .append("text")
      .attr("dy", (d) => radius(d) + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", 11)
      .attr("font-family", "var(--font-geist-mono)")
      .attr("font-weight", "500")
      .style("pointer-events", "none")
      .text((d) => d.data.label);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        if (event.sourceEvent) {
          setViewport({
            x: event.transform.x,
            y: event.transform.y,
            zoom: event.transform.k,
          });
        }
      });
    svg.call(zoom);
    const vp = viewportRef.current;
    if (vp.zoom !== 1 || vp.x !== 0 || vp.y !== 0) {
      svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(vp.x, vp.y).scale(vp.zoom)
      );
    }
  }, [tree, expandedNodes, selectedNodeId, selectNode, setViewport]);
  useEffect(() => {
    render();
    const onResize = () => render();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [render]);
  if (!tree) {
    return (
      <div className="flex items-center justify-center h-full text-[rgba(255,255,255,0.2)] text-sm font-mono">
        No tree loaded ΓÇö generate one from the home page.
      </div>
    );
  }
  return (
    <svg
      ref={svgRef}
      className="h-full w-full"
      style={{
        background: "#0c0c0c",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}
