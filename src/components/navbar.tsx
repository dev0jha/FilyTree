"use client";
import React from "react";
import { FaGithub } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";

import FramerCtaButton from "@/components/pixel-perfect/framer-cta-button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="relative size-9 overflow-hidden rounded-xl p-1.5 transition-colors">
              <Image
                src="/filytree.png"
                alt="FilyTree Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white/90">
              Fily<span className="text-emerald-500">Tree</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dev0jha/FilyTree"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <FramerCtaButton variant="dark" className="h-10 rounded-xl px-5">
                <div className="flex items-center gap-2">
                  <FaGithub className="size-4" />
                  <span>GitHub</span>
                </div>
              </FramerCtaButton>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
