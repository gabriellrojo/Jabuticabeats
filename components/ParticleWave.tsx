"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ParticleWaveProps {
  className?: string
  onReady?: () => void
}

export function ParticleWave({ className = "", onReady }: ParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasCalledReadyRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const winWidth = window.innerWidth
    const winHeight = window.innerHeight

    const camera = new THREE.PerspectiveCamera(
      75,
      winWidth / winHeight,
      0.01,
      1000
    )

    camera.position.set(0, 6, 5)

    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    })

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(winWidth, winHeight)
    renderer.setClearColor(0x000000)

    const particleVertex = `
      attribute float scale;
      uniform float uTime;

      void main() {
        vec3 p = position;
        float s = scale;

        p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
        p.x += (sin(p.y + uTime) * 0.5);

        s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

        gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const particleFragment = `
      uniform vec3 uColor;

      void main() {
        gl_FragColor = vec4(uColor, 0.65);
      }
    `

    const gap = 0.3
    const amountX = 200
    const amountY = 200
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
      transparent: true,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(0.58, 0.2, 0.92) },
      },
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)

    scene.add(particles)

    let animationId: number

    const animate = () => {
      particleMaterial.uniforms.uTime.value += 0.05

      camera.lookAt(scene.position)
      renderer.render(scene, camera)

      if (!hasCalledReadyRef.current) {
        hasCalledReadyRef.current = true
        onReady?.()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)

      window.removeEventListener("resize", handleResize)

      scene.remove(particles)

      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [onReady])

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
      }}
    />
  )
}