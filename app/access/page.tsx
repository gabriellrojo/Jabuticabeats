"use client"

import Link from "next/link"
import { useState } from "react"

import { ParticleWave } from "@/components/ParticleWave"
import TextRoll from "@/components/TextRoll"

const links = [
  {
    label: "SOBRE",
    href: "/sobre",
  },
  {
    label: "SERVIÇOS",
    href: "/servicos",
  },
  {
    label: "GALERIA",
    href: "/galeria",
  },
  {
    label: "PORTFOLIO",
    href: "/portfolio",
  },
  {
    label: "CONTATO",
    href: "/contato",
  },
]

export default function AcessarPage() {
  const [bgReady, setBgReady] = useState(false)

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-black">
      <ParticleWave
        className="fixed inset-0"
        onReady={() => setBgReady(true)}
      />

      <section
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center transition-opacity duration-[1800ms] ease-out ${
          bgReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {links.map((item, index) => (
          <div
            key={item.label}
            className={`transition-all duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              bgReady
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
            style={{
              transitionDelay: `${index * 220 + 300}ms`,
            }}
          >
            <Link
              href={item.href}
              className="cursor-pointer"
            >
              <TextRoll
                center
                className="text-3xl font-bold tracking-tight text-white md:text-5xl"
              >
                {item.label}
              </TextRoll>
            </Link>
          </div>
        ))}
      </section>

      {!bgReady && <div className="fixed inset-0 z-50 bg-black" />}
    </main>
  )
}