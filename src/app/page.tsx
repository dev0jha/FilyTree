import { HeroSection } from "@/components/landing/Hero";
import { BentoFeatures } from "@/components/landing/Features";
import { Navbar } from "@/components/landing/Navbar";
import Link from "next/link";
export const metadata = {
  title: "FilyTree — AI Architecture Canvas",
  description:
    "Turn any PRD or repository into an interactive architecture tree. Powered by Grok AI.",
};
export default function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-[#121212] text-white selection:bg-[#3d8a6b] selection:text-white">
      <Navbar />
      <HeroSection />
      <BentoFeatures />
      {}
      <footer className="py-16 px-6 border-t border-[rgba(255,255,255,0.06)] mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-[rgba(255,255,255,0.35)]">
          <div className="col-span-2">
            <h3 className="text-base font-bold text-white mb-3 tracking-tighter">
              FilyTree
            </h3>
            <p className="max-w-[300px] text-sm leading-relaxed">
              Visualizing the future of code navigation. Built for engineers who
              think in systems.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[rgba(255,255,255,0.6)] mb-4 text-xs uppercase tracking-widest">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/canvas"
                  className="hover:text-white transition-colors duration-200"
                >
                  Canvas
                </Link>
              </li>
              <li>
                <Link
                  href="/analysis"
                  className="hover:text-white transition-colors duration-200"
                >
                  Analysis
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[rgba(255,255,255,0.6)] mb-4 text-xs uppercase tracking-widest">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[rgba(255,255,255,0.2)]">
            © 2026 FilyTree. Frontend-only. Powered by Groq.
          </span>
        </div>
      </footer>
    </main>
  );
}
