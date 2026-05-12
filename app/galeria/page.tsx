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
    <main className="relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black">
      <ParticleWave
        className="fixed inset-0"
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

      <div
        className={`relative z-10 w-full transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <section className="w-full py-10">
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
        </section>

        <div className="relative z-20 mt-10 flex justify-center">
          <Link
            href="/access"
            className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-80 md:text-base"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-2">
              ←
            </span>

            <span>voltar</span>
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {!ready && <div className="fixed inset-0 z-50 bg-black" />}
    </main>
  )
}