"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { motion } from "motion/react"

import { ParticleWave } from "@/components/ParticleWave"

const fullText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo sed neque pretium feugiat. Integer non ipsum sit amet tortor gravida porta. Suspendisse potenti. Praesent viverra, lorem sed efficitur dignissim, sem magna tincidunt erat, vitae fermentum neque lorem non massa.

Curabitur euismod, justo vitae rhoncus facilisis, risus libero luctus massa, sed luctus justo arcu sed ipsum. Donec tempor sapien vel turpis feugiat, nec gravida lorem malesuada. Nulla facilisi. Maecenas at neque ut lorem malesuada luctus. Integer vel sem non magna consequat fermentum.

Aliquam erat volutpat. Duis sit amet velit non justo porta posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi ac sapien vel justo tincidunt aliquam. Vivamus dignissim, nibh sed facilisis pretium, magna nulla posuere lectus, ac faucibus ipsum elit sed nisl.`

const testimonials = [
  {
    id: 12,
    author: "Marina Costa",
    testimonial:
      "A experiência foi impecável. Tudo teve identidade, cuidado e uma estética muito forte.",
  },
  {
    id: 32,
    author: "Rafael Nunes",
    testimonial:
      "O projeto entregou exatamente o clima que a gente queria: moderno, intenso e memorável.",
  },
  {
    id: 45,
    author: "Bianca Torres",
    testimonial:
      "Visual, som e conceito conversando perfeitamente. Ficou muito acima do esperado.",
  },
]

type Position = "front" | "middle" | "back"

type Testimonial = {
  id: number
  author: string
  testimonial: string
}

function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
}: {
  handleShuffle: () => void
  testimonial: Testimonial
  position: Position
}) {
  const dragRef = useRef(0)

  const isFront = position === "front"

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? 3 : position === "middle" ? 2 : 1,
      }}
      animate={{
        rotate:
          position === "front"
            ? "-6deg"
            : position === "middle"
              ? "0deg"
              : "6deg",
        x:
          position === "front"
            ? "0%"
            : position === "middle"
              ? "33%"
              : "66%",
        scale:
          position === "front"
            ? 1
            : position === "middle"
              ? 0.96
              : 0.92,
      }}
      drag
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onDragStart={(event) => {
        if ("clientX" in event) {
          dragRef.current = event.clientX
        }
      }}
      onDragEnd={(event) => {
        if ("clientX" in event) {
          if (dragRef.current - event.clientX > 150) {
            handleShuffle()
          }
        }

        dragRef.current = 0
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[420px] w-[310px] select-none place-content-center space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:h-[450px] md:w-[350px] ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img
        src={`https://i.pravatar.cc/128?img=${testimonial.id}`}
        alt={`Avatar de ${testimonial.author}`}
        className="pointer-events-none mx-auto h-28 w-28 rounded-full border border-white/20 bg-white/10 object-cover md:h-32 md:w-32"
      />

      <span className="text-center text-base italic text-white/70 md:text-lg">
        “{testimonial.testimonial}”
      </span>

      <span className="text-center text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
        {testimonial.author}
      </span>
    </motion.div>
  )
}

function TestimonialsStack() {
  const [cards, setCards] = useState(testimonials)

  const handleShuffle = () => {
    setCards((prev) => {
      const copy = [...prev]

      const first = copy.shift()

      if (first) copy.push(first)

      return copy
    })
  }

  const positions: Position[] = ["front", "middle", "back"]

  return (
    <div className="relative h-[460px] w-[520px] max-w-full md:w-[620px]">
      {cards.map((item, index) => (
        <TestimonialCard
          key={item.author}
          testimonial={item}
          position={positions[index] || "back"}
          handleShuffle={handleShuffle}
        />
      ))}
    </div>
  )
}

export default function Sobre() {
  const [bgReady, setBgReady] = useState(false)

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      <ParticleWave
        className="fixed inset-0"
        onReady={() => setBgReady(true)}
      />

      <section
        className={`relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-16 px-6 py-24 transition-opacity duration-700 md:px-10 ${
          bgReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-4xl">
          <h1 className="mb-10 text-5xl font-bold tracking-tight text-white md:text-8xl">
            SOBRE
          </h1>

          <p className="whitespace-pre-line text-base leading-8 text-white/75 md:text-lg md:leading-9">
            {fullText}
          </p>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Depoimentos
            </h2>

            <p className="mt-5 text-white/60">
              Arraste o primeiro card para a esquerda para ver o próximo.
            </p>
          </div>

          <TestimonialsStack />
        </div>

        <Link
          href="/access"
          className="group inline-flex w-fit items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-80 md:text-base"
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