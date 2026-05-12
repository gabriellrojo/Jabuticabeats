"use client"

import Link from "next/link"
import { useState } from "react"

import { ParticleWave } from "@/components/ParticleWave"

export default function ServicosPage() {
  const [bgReady, setBgReady] = useState(false)

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-black">
      <ParticleWave
        className="fixed inset-0"
        onReady={() => setBgReady(true)}
      />

      <section
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 transition-opacity duration-700 ${
          bgReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link
          href="/access"
          className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-80 md:text-base"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-2">
            ←
          </span>

          <span>voltar</span>
        </Link>
      </section>

      {!bgReady && <div className="fixed inset-0 z-50 bg-black" />}
    </main>
  )
}