import { HeroSection } from '@/components/hero'
import { Navbar } from '@/components/navbar'
import React from 'react'

function page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  )
}

export default page
