"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import {
  TreeStructure,
  GithubLogo,
  Lightning,
  ArrowRight,
  Circle,
  Dot,
  FolderOpen,
  FileTs,
  GitBranch,
  Cpu,
  Function,
} from "@phosphor-icons/react";
import { GenerationModal } from "../ui/GenerationModal";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]";
function useScramble(target: string, delay = 0) {
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    let frame = 0;
    let iteration = 0;
    const totalFrames = target.length * 3;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(
          target
            .split("")
            .map((char, idx) => {
              if (char === " ") return " ";
              if (idx < iteration) return target[idx];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        iteration += 0.5;
        frame++;
        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplay(target);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return display;
}
function TreeNode({
  label,
  icon: Icon,
  color,
  depth = 0,
  delay = 0,
  children,
}: {
  label: string;
  icon: React.ElementType;
  color: string;
  depth?: number;
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
      style={{ paddingLeft: depth * 16 }}
      className="select-none"
    >
      <div className="flex items-center gap-2 py-[5px] group cursor-pointer">
        {depth > 0 && (
          <span className="text-[rgba(255,255,255,0.12)] text-xs font-mono mr-0.5">
            ─
          </span>
        )}
        <Icon size={13} weight="fill" className={color} />
        <span className="text-[13px] font-mono text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors duration-200">
          {label}
        </span>
      </div>
      {children}
    </motion.div>
  );
}
function CanvasMockup() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="w-full h-full rounded-[1.75rem] bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] overflow-hidden relative flex flex-col">
      {}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#111111]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] font-mono text-[rgba(255,255,255,0.3)]">
          filytree — canvas
        </span>
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#3d8a6b]"
          />
          <span className="text-[10px] font-mono text-[rgba(255,255,255,0.25)]">
            AI ACTIVE
          </span>
        </div>
      </div>
      {}
      <div className="flex flex-1 overflow-hidden">
        {}
        <div className="w-[180px] border-r border-[rgba(255,255,255,0.05)] p-3 bg-[#0f0f0f] flex-shrink-0 overflow-hidden">
          <div className="text-[9px] font-mono text-[rgba(255,255,255,0.25)] uppercase tracking-widest mb-3 px-1">
            Explorer
          </div>
          <TreeNode label="frontend/" icon={FolderOpen} color="text-[#3d8a6b]" delay={0.5}>
            <TreeNode label="components/" icon={FolderOpen} color="text-[#3d8a6b]" depth={1} delay={0.6} />
            <TreeNode label="hooks/" icon={FolderOpen} color="text-[#3d8a6b]" depth={1} delay={0.7} />
            <TreeNode label="app.tsx" icon={FileTs} color="text-blue-400" depth={1} delay={0.75} />
          </TreeNode>
          <TreeNode label="backend/" icon={FolderOpen} color="text-[#3d8a6b]" delay={0.8}>
            <TreeNode label="services/" icon={FolderOpen} color="text-[#3d8a6b]" depth={1} delay={0.85} />
            <TreeNode label="ai/" icon={Cpu} color="text-amber-400" depth={1} delay={0.9} />
          </TreeNode>
        </div>
        {}
        <div className="flex-1 relative overflow-hidden bg-[#0c0c0c]">
          {}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <motion.line
              x1="80" y1="80" x2="180" y2="160"
              stroke="rgba(61,138,107,0.3)" strokeWidth="1.5" strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
            <motion.line
              x1="80" y1="80" x2="60" y2="160"
              stroke="rgba(61,138,107,0.2)" strokeWidth="1" strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
            />
            <motion.line
              x1="180" y1="160" x2="270" y2="230"
              stroke="rgba(96,165,250,0.25)" strokeWidth="1" strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          {}
          {[
            { id: "root", label: "project/", x: 55, y: 55, icon: GitBranch, col: "text-[#3d8a6b]", bg: "bg-[#3d8a6b]/10 border-[#3d8a6b]/30" },
            { id: "frontend", label: "frontend/", x: 145, y: 135, icon: FolderOpen, col: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
            { id: "backend", label: "backend/", x: 20, y: 135, icon: Function, col: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
            { id: "ai", label: "ai/", x: 235, y: 200, icon: Cpu, col: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.9 + i * 0.18,
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
              whileHover={{ scale: 1.06, zIndex: 20 }}
              onClick={() => setActive(node.id === active ? null : node.id)}
              className={`absolute flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer backdrop-blur-sm transition-all ${node.bg}`}
              style={{ left: node.x, top: node.y, zIndex: 10 }}
            >
              <node.icon size={12} weight="fill" className={node.col} />
              <span className={`text-[11px] font-mono ${node.col}`}>{node.label}</span>
              {active === node.id && (
                <motion.div
                  layoutId="node-glow"
                  className="absolute inset-0 rounded-xl ring-1 ring-[#3d8a6b]/50"
                  initial={false}
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, type: "spring", stiffness: 80, damping: 20 }}
            className="absolute bottom-5 right-5 z-20"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="w-1.5 h-1.5 rounded-full bg-[#3d8a6b]"
              />
              <span className="text-[10px] font-mono text-[rgba(255,255,255,0.5)] uppercase tracking-widest">
                Analyzing
              </span>
              <span className="text-[10px] font-mono text-[rgba(255,255,255,0.3)]">
                7 issues found
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      {}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-[rgba(255,255,255,0.05)] bg-[#0f0f0f]">
        <span className="text-[9px] font-mono text-[rgba(255,255,255,0.2)] uppercase tracking-widest">
          GROQ-2
        </span>
        <div className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />
        <span className="text-[9px] font-mono text-[rgba(255,255,255,0.2)]">
          24 nodes · 3 layers
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
            <motion.div
              animate={{ width: ["0%", "73%"] }}
              transition={{ delay: 2.2, duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-[#3d8a6b]"
            />
          </div>
          <span className="text-[9px] font-mono text-[rgba(255,255,255,0.25)]">73%</span>
        </div>
      </div>
    </div>
  );
}
export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const badge = useScramble("POWERED BY GROQ AI", 300);
  const h1Line1 = useScramble("Turn any PRD", 600);
  const h1Line2 = useScramble("into a living", 900);
  return (
    <>
      {}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 72% 50%, rgba(61,138,107,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(96,165,250,0.04) 0%, transparent 70%)",
        }}
      />
      <section className="relative min-h-[100dvh] flex items-center pt-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 xl:gap-16 items-center">
          {}
          <div className="z-10">
            {}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 22 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(61,138,107,0.35)] bg-[rgba(61,138,107,0.08)] mb-8"
            >
              <Lightning weight="fill" className="text-[#3d8a6b] w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold text-[#3d8a6b] tracking-[0.18em]">
                {badge}
              </span>
            </motion.div>
            {}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 70, damping: 20 }}
              className="text-[clamp(3rem,6vw,6rem)] font-bold tracking-tighter leading-[0.88] text-white mb-6"
            >
              {h1Line1}
              <br />
              {h1Line2}
              <br />
              <span className="text-[#3d8a6b]">architecture.</span>
            </motion.h1>
            {}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 70, damping: 20 }}
              className="text-[rgba(255,255,255,0.45)] text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed max-w-[44ch] mb-10"
            >
              FilyTree reads your PRD or repo and renders a fully interactive
              architecture canvas — powered by Grok. Identify bottlenecks,
              trace logic, and refactor with AI clarity.
            </motion.p>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, type: "spring", stiffness: 70, damping: 20 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#3d8a6b] text-white font-bold text-sm overflow-hidden transition-all duration-300 hover:bg-[#4a9f7e] active:scale-[0.97] shadow-[0_0_0_1px_rgba(61,138,107,0.5),0_8px_32px_rgba(61,138,107,0.2)]"
              >
                <TreeStructure weight="bold" className="w-4 h-4" />
                Generate Architecture
                <ArrowRight
                  weight="bold"
                  className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] text-[rgba(255,255,255,0.75)] font-bold text-sm transition-all duration-300 hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] active:scale-[0.97]"
              >
                <GithubLogo weight="bold" className="w-4 h-4" />
                Analyze Repo
              </button>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-5 mt-12"
            >
              {[
                { label: "1,200+ repos analyzed" },
                { label: "Grok-2 powered" },
                { label: "No backend needed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Circle
                    weight="fill"
                    size={5}
                    className="text-[#3d8a6b] opacity-60"
                  />
                  <span className="text-[11px] font-mono text-[rgba(255,255,255,0.3)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[460px] lg:h-[580px] rounded-[2rem] overflow-hidden border border-[rgba(255,255,255,0.07)] shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <CanvasMockup />
          </motion.div>
        </div>
      </section>
      <GenerationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
