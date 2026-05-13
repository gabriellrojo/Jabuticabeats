"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface WaveAnimationProps {
  width?: number
  height?: number
  pointSize?: number
  waveSpeed?: number
  waveIntensity?: number
  particleColor?: string
  gridDistance?: number
  className?: string
}

export function WaveAnimation({
  width,
  height,
  pointSize = 1.8,
  waveSpeed = 2.0,
  waveIntensity = 8.0,
  particleColor = "#7c3aed",
  gridDistance = 5,
  className = "",
}: WaveAnimationProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const [waveReady, setWaveReady] = useState(false)

  useEffect(() => {
    const preload = document.createElement("link")
    preload.rel = "preload"
    preload.as = "image"
    preload.href = "/images/jabuticabeats-logo.png"
    document.head.appendChild(preload)

    return () => {
      if (preload.parentNode) {
        preload.parentNode.removeChild(preload)
      }
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const container = canvasRef.current

    let renderer: THREE.WebGLRenderer | null = null
    let geo: THREE.BufferGeometry | null = null
    let mat: THREE.ShaderMaterial | null = null

    try {
      const w = width || window.innerWidth
      const h = height || window.innerHeight
      const isMobile = window.innerWidth <= 768
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)

      const fov = 60
      const fovRad = (fov / 2) * (Math.PI / 180)
      const dist = h / 2 / Math.tan(fovRad)

      const clock = new THREE.Clock()

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      })

      renderer.setSize(w, h)
      renderer.setPixelRatio(dpr)
      renderer.setClearColor(0x000000, 1)

      rendererRef.current = renderer
      container.appendChild(renderer.domElement)

      const camera = new THREE.PerspectiveCamera(fov, w / h, 1, dist * 2)
      camera.position.set(0, 0, 10)

      const scene = new THREE.Scene()
      geo = new THREE.BufferGeometry()

      const positions: number[] = []

      const mobileMultiplier = isMobile ? 0.65 : 1
      const gridWidth = 400 * (w / h) * mobileMultiplier
      const depth = 400 * mobileMultiplier
      const finalGridDistance = isMobile ? Math.max(gridDistance, 8) : gridDistance

      for (let x = 0; x < gridWidth; x += finalGridDistance) {
        for (let z = 0; z < depth; z += finalGridDistance) {
          positions.push(-gridWidth / 2 + x, -30, -depth / 2 + z)
        }
      }

      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      )

      mat = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0.0 },
          u_point_size: { value: isMobile ? pointSize * 1.15 : pointSize },
          u_color: { value: new THREE.Color(particleColor) },
        },
        vertexShader: `
          #define M_PI 3.1415926535897932384626433832795

          precision mediump float;

          uniform float u_time;
          uniform float u_point_size;

          void main() {
            vec3 p = position;

            p.y += (
              cos(p.x / M_PI * ${waveIntensity.toFixed(1)} + u_time * ${waveSpeed.toFixed(1)}) +
              sin(p.z / M_PI * ${waveIntensity.toFixed(1)} + u_time * ${waveSpeed.toFixed(1)})
            ) * 2.0;

            gl_PointSize = u_point_size;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          precision mediump float;

          uniform vec3 u_color;

          void main() {
            gl_FragColor = vec4(u_color, 1.0);
          }
        `,
      })

      const mesh = new THREE.Points(geo, mat)
      scene.add(mesh)

      let firstFrameRendered = false

      function render() {
        if (!renderer) return

        mesh.material.uniforms.u_time.value = clock.getElapsedTime()
        renderer.render(scene, camera)

        if (!firstFrameRendered) {
          firstFrameRendered = true
          setWaveReady(true)
        }

        animationIdRef.current = requestAnimationFrame(render)
      }

      render()

      const handleResize = () => {
        if (!renderer || width || height) return

        const newW = window.innerWidth
        const newH = window.innerHeight

        camera.aspect = newW / newH
        camera.updateProjectionMatrix()

        renderer.setSize(newW, newH)
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)

        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
        }

        if (rendererRef.current?.domElement?.parentNode === container) {
          container.removeChild(rendererRef.current.domElement)
        }

        rendererRef.current?.dispose()
        geo?.dispose()
        mat?.dispose()
      }
    } catch (error) {
      console.error("Erro ao iniciar WaveAnimation:", error)
      setWaveReady(true)

      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
        }

        rendererRef.current?.dispose()
        geo?.dispose()
        mat?.dispose()
      }
    }
  }, [
    width,
    height,
    pointSize,
    waveSpeed,
    waveIntensity,
    particleColor,
    gridDistance,
  ])

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-black">
      <style jsx>{`
        @keyframes logoZoomIn {
          from {
            opacity: 0;
            transform: scale(0.72);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .logo-zoom-in {
          opacity: 0;
          animation: logoZoomIn 2200ms ease-out both;
        }

        @keyframes accessFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="relative z-0">
        <div
          ref={canvasRef}
          className={className}
          style={{
            width: width || "100vw",
            height: height || "100dvh",
            overflow: "hidden",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center">
          <div className="pointer-events-auto relative mb-2 h-[150px] w-[92vw] max-w-[1720px] md:h-[380px] md:w-[86vw]">
            <img
              src="/images/jabuticabeats-logo.png"
              alt="Jabuticabeats"
              className="logo-zoom-in h-full w-full object-contain"
              draggable={false}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
          </div>

          <a
            href="/access"
            className="pointer-events-auto group mt-6 inline-flex items-center gap-3 text-base font-medium uppercase tracking-[0.2em] text-white transition-opacity duration-500 hover:opacity-80 md:text-lg"
            style={{
              opacity: 0,
              animation: "accessFadeIn 1400ms ease-out 2200ms forwards",
            }}
          >
            <span>acessar</span>

            <span className="transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </a>
        </div>
      </div>

      {!waveReady && <div className="absolute inset-0 z-30 bg-black" />}
    </div>
  )
}