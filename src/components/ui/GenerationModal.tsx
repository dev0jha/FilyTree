"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightning, GithubLogo } from "@phosphor-icons/react";
import { PrdInput } from "../inputs/PrdInput";
import { RepoInput } from "../inputs/RepoInput";
import { cn } from "@/lib/utils";
interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function GenerationModal({ isOpen, onClose }: GenerationModalProps) {
  const [activeTab, setActiveTab] = useState<"prd" | "repo">("prd");
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[70] overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[#181818] shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            {}
            <div className="flex border-b border-[rgba(255,255,255,0.06)]">
              <button
                onClick={() => setActiveTab("prd")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all",
                  activeTab === "prd"
                    ? "text-white bg-[rgba(255,255,255,0.04)]"
                    : "text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)]"
                )}
              >
                <Lightning
                  weight={activeTab === "prd" ? "fill" : "bold"}
                  className={activeTab === "prd" ? "text-[#3d8a6b]" : ""}
                />
                PRD to Architecture
              </button>
              <button
                onClick={() => setActiveTab("repo")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all",
                  activeTab === "repo"
                    ? "text-white bg-[rgba(255,255,255,0.04)]"
                    : "text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)]"
                )}
              >
                <GithubLogo
                  weight={activeTab === "repo" ? "fill" : "bold"}
                  className={activeTab === "repo" ? "text-blue-400" : ""}
                />
                Analyze Repository
              </button>
            </div>
            {}
            <div className="p-8">
              {activeTab === "prd" ? <PrdInput onSuccess={onClose} /> : <RepoInput onSuccess={onClose} />}
            </div>
            {}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
            >
              <X weight="bold" size={18} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
