"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ParticleWaveProps {
  className?: string
  onReady?: () => void
}

export function ParticleWave({ className = "", onReady }: ParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onReadyRef = useRef(onReady)
  const hasCalledReadyRef = useRef(false)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const isMobile = window.innerWidth <= 768

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.4 : 2))
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    renderer.setClearColor(0x000000, 1)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )

    camera.position.set(0, 6, 5)

    const scene = new THREE.Scene()
    const clock = new THREE.Clock()

    const particleVertex = `
      attribute float scale;
      uniform float uTime;

      void main() {
        vec3 p = position;
        float s = scale;

        p.y += (sin(p.x + uTime) * 0.5) + (cos(p.z + uTime) * 0.2);
        p.x += sin(p.z + uTime) * 0.25;

        s += (sin(p.x + uTime) * 0.5) + (cos(p.z + uTime) * 0.2);

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

        gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const particleFragment = `
      precision mediump float;
      uniform vec3 uColor;

      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `

    const gap = isMobile ? 0.42 : 0.3
    const amountX = isMobile ? 120 : 180
    const amountY = isMobile ? 120 : 180
    const particleNum = amountX * amountY

    const particlePositions = new Float32Array(particleNum * 3)
    const particleScales = new Float32Array(particleNum)

    let i = 0
    let j = 0

    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - (amountX * gap) / 2
        particlePositions[i + 1] = 0
        particlePositions[i + 2] = iy * gap - (amountY * gap) / 2

        particleScales[j] = 1

        i += 3
        j++
      }
    }

    const particleGeometry = new THREE.BufferGeometry()

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    )

    particleGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(particleScales, 1)
    )

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(0.58, 0.2, 0.92) },
      },
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    let animationId = 0
    let disposed = false

    const renderFrame = () => {
      if (disposed) return

      particleMaterial.uniforms.uTime.value = clock.getElapsedTime() * 2.5

      camera.lookAt(scene.position)
      renderer.render(scene, camera)

      if (!hasCalledReadyRef.current) {
        hasCalledReadyRef.current = true

        requestAnimationFrame(() => {
          onReadyRef.current?.()
        })
      }

      animationId = requestAnimationFrame(renderFrame)
    }

    renderer.compile(scene, camera)
    renderFrame()

    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, window.innerWidth <= 768 ? 1.4 : 2)
      )

      renderer.setSize(newWidth, newHeight, false)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      disposed = true

      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)

      scene.remove(particles)

      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{
        width: "100vw",
        height: "100dvh",
        margin: 0,
        overflow: "hidden",
        display: "block",
      }}
    />
  )
}