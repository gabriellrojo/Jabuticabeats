"use client"

import Image from "next/image"
import { Play } from "lucide-react"

export function PortfolioSpotifyCard() {
  function handleOpenSpotify() {
    window.open("https://open.spotify.com", "_blank", "noopener,noreferrer")
  }

  return (
    <button
      type="button"
      onClick={handleOpenSpotify}
      className="cursor-pointer group w-full max-w-sm overflow-hidden rounded-3xl border border-green-400/10 bg-[#031107] text-left shadow-2xl transition hover:scale-[1.01]"
      aria-label="Abrir Spotify"
    >
      <div className="bg-gradient-to-b from-green-500/20 via-green-950/60 to-black p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-black shadow-2xl">
            <svg viewBox="0 0 24 24" className="h-11 w-11 fill-[#1ed760]">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>

          <h2 className="text-5xl font-semibold tracking-tight text-white">
            Spotify
          </h2>
        </div>

        <p className="mb-6 text-2xl font-light leading-snug tracking-wide text-white/85">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, browse your
          library, and control playback.
        </p>

        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src="/images/photo-1.png"
            alt="Portfolio cover"
            fill
            priority
            sizes="384px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />

          <div className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-2xl transition group-hover:scale-105 group-hover:bg-[#1fdf64]">
            <Play size={30} fill="currentColor" className="ml-1" />
          </div>
        </div>
      </div>

      <div className="bg-black px-6 py-5">
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 rounded-full bg-[#1ed760]" />
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <span>0:42</span>
          <span>3:21</span>
        </div>
      </div>
    </button>
  )
}