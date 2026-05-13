"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeStructure } from "@phosphor-icons/react";
import Link from "next/link";
import { GenerationModal } from "../ui/GenerationModal";
export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] backdrop-blur-md pointer-events-auto transition-all hover:bg-[rgba(255,255,255,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <TreeStructure weight="bold" size={20} className="text-[#3d8a6b]" />
            <span className="font-bold tracking-tighter text-base text-white">
              FilyTree
            </span>
          </Link>
          {}
          <div className="hidden md:flex items-center gap-6 px-5 py-2 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] backdrop-blur-md pointer-events-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            {["Canvas", "Analysis", "Architecture", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
          {}
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-[#3d8a6b] text-white text-sm font-bold shadow-[0_0_0_1px_rgba(61,138,107,0.4),0_4px_16px_rgba(61,138,107,0.2)] transition-all hover:bg-[#4a9f7e] active:scale-95"
            >
              Launch Canvas
            </button>
          </div>
        </div>
      </motion.nav>
      <GenerationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
