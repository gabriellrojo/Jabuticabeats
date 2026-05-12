"use client"

import Link from "next/link"
import { useState } from "react"

import { ParticleWave } from "@/components/ParticleWave"
import { ContactForm } from "@/components/ContactForm"

export default function Contato() {
  const [bgReady, setBgReady] = useState(false)

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-black">
      <ParticleWave
        className="fixed inset-0"
        onReady={() => setBgReady(true)}
      />

      <section
        className={`relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-24 text-center transition-opacity duration-[1800ms] ease-out ${
          bgReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`transition-all duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            bgReady
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: "250ms" }}
        >
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-8xl">
            CONTATO
          </h1>

          <p className="mt-5 max-w-2xl text-white/60">
            Envie sua mensagem e conte um pouco sobre o que você precisa.
          </p>
        </div>

        <ContactForm />

        <Link
          href="/access"
          className={`group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-80 md:text-base ${
            bgReady
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <span className="transition-transform duration-500 group-hover:-translate-x-2">
            ←
          </span>

          <span>voltar</span>
        </Link>
      </section>

      {!bgReady && <div className="fixed inset-0 z-50 bg-black" />}
    </main>
  )
}