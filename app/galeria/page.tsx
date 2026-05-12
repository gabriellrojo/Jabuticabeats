"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

import { ParticleWave } from "@/components/ParticleWave"

const photos = [
  "/images/photo-1.png",
  "/images/photo-2.png",
  "/images/photo-3.png",
  "/images/photo-4.png",
]

const duplicatedPhotos = [...photos, ...photos, ...photos]

export default function Galeria() {
  const [bgReady, setBgReady] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const totalPriorityImages = 4

  const ready = bgReady && imagesLoaded >= totalPriorityImages

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-black">
      <ParticleWave
        className="fixed inset-0 h-screen w-screen"
        onReady={() => setBgReady(true)}
      />

      <style jsx global>{`
        @keyframes gallery-scroll {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-33.333%);
          }
        }

        .gallery-scroll {
          animation: gallery-scroll 28s linear infinite;
        }

        .gallery-mask {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );

          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }
      `}</style>

      <section
        className={`relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-0 py-24 transition-opacity duration-[1800ms] ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`mb-12 flex flex-col items-center px-6 text-center transition-all duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{
            transitionDelay: "250ms",
          }}
        >
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-8xl">
            GALERIA
          </h1>

          <p className="mt-5 max-w-2xl text-white/60">
            Registros visuais, atmosferas e fragmentos de identidade em
            movimento.
          </p>
        </div>

        <div
          className={`w-full transition-all duration-[2600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{
            transitionDelay: "500ms",
          }}
        >
          <div className="gallery-mask w-full overflow-hidden">
            <div className="gallery-scroll flex w-max gap-8 px-8 md:gap-10 md:px-10">
              {duplicatedPhotos.map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  className="relative h-[460px] w-[300px] flex-shrink-0 overflow-hidden rounded-3xl shadow-2xl transition duration-300 hover:scale-105 hover:brightness-110 md:h-[620px] md:w-[400px]"
                >
                  <Image
                    src={photo}
                    alt={`Foto ${(index % photos.length) + 1}`}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover"
                    onLoad={() => {
                      if (index < 4) {
                        setImagesLoaded((prev) => prev + 1)
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`relative z-20 mt-16 flex justify-center transition-all duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{
            transitionDelay: "850ms",
          }}
        >
          <Link
            href="/access"
            className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-80 md:text-base"
          >
            <span className="transition-transform duration-500 group-hover:-translate-x-2">
              ←
            </span>

            <span>voltar</span>
          </Link>
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {!ready && <div className="fixed inset-0 z-50 bg-black" />}
    </main>
  )
}