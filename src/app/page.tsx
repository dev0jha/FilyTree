import React from "react";

import { HeroSection } from "@/components/hero";
import { Navbar } from "@/components/navbar";

function page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}

export default page;
