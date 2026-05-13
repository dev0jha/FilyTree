"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Graph,
  Files,
  FlowArrow,
  Cpu,
  GithubLogo,
} from "@phosphor-icons/react";
const bentoCards = [
  {
    title: "Visual Hierarchy",
    description:
      "Map thousands of files into a nested canvas that reveals real architecture — not just a flat list.",
    icon: Graph,
    className: "md:col-span-2 md:row-span-2",
    accent: "#3d8a6b",
    accentBg: "rgba(61,138,107,0.08)",
    accentBorder: "rgba(61,138,107,0.2)",
  },
  {
    title: "AI-Powered Analysis",
    description:
      "Groq-3 explains structure decisions, detects god-folders, and surfaces hidden coupling.",
    icon: Cpu,
    className: "",
    accent: "#60a5fa",
    accentBg: "rgba(96,165,250,0.07)",
    accentBorder: "rgba(96,165,250,0.18)",
  },
  {
    title: "ZIP to Canvas",
    description:
      "Drop any project archive and watch it bloom into a navigable visual tree in seconds.",
    icon: Files,
    className: "",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.18)",
  },
  {
    title: "Logic Flow & Dependencies",
    description:
      "Trace data paths and module dependencies with animated connection lines across the canvas.",
    icon: FlowArrow,
    className: "md:col-span-full",
    accent: "rgba(255,255,255,0.6)",
    accentBg: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.07)",
  },
];
export function BentoFeatures() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-[11px] font-mono text-[#3d8a6b] tracking-[0.2em] uppercase mb-4"
        >
          Core Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, type: "spring", stiffness: 100, damping: 20 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-none mb-5"
        >
          Deep project
          <br />
          intelligence.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, type: "spring", stiffness: 100, damping: 20 }}
          className="text-[rgba(255,255,255,0.4)] max-w-[58ch] leading-relaxed"
        >
          FilyTree is a spatial workspace for your codebase — not just a viewer.
          Every interaction is backed by Groq&apos;s architecture reasoning.
        </motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bentoCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: idx * 0.09,
              type: "spring",
              stiffness: 80,
              damping: 22,
            }}
            whileHover={{ y: -3 }}
            className={cn(
              "group relative p-8 rounded-[1.75rem] border overflow-hidden transition-all duration-300",
              "shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]",
              "hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]",
              card.className
            )}
            style={{
              background: card.accentBg,
              borderColor: card.accentBorder,
            }}
          >
            {}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
              style={{
                background: `${card.accent}18`,
                border: `1px solid ${card.accent}30`,
              }}
            >
              <card.icon weight="bold" size={20} style={{ color: card.accent }} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white tracking-tight">
              {card.title}
            </h3>
            <p
              className="leading-relaxed text-sm max-w-[48ch]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {card.description}
            </p>
            {}
            <div
              className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: card.accent }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
