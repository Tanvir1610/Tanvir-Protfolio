"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Stars } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

function FloatingShapes() {
  // simple procedural scene with a few shapes for a 3D feel
  return (
    <>
      <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1}>
        <mesh position={[-1.2, 0.4, 0]}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={"#6366f1"} metalness={0.4} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[1.4, -0.2, 0.2]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={"#164e63"} metalness={0.35} roughness={0.25} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[0, 0.9, -0.4]}>
          <torusKnotGeometry args={[0.4, 0.12, 100, 16]} />
          <meshStandardMaterial color={"#14b8a6"} metalness={0.3} roughness={0.3} />
        </mesh>
      </Float>
    </>
  )
}

function TypeWriter({ text, speed = 35 }: { text: string; speed?: number }) {
  const [out, setOut] = useState("")
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return (
    <span>
      {out}
      <span className="inline-block w-[1ch] animate-pulse translate-y-[1px]">|</span>
    </span>
  )
}

export function Hero3D() {
  // subtle parallax for overlay content
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const spring = { type: "spring", stiffness: 120, damping: 18 }

  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({
      x: (py - 0.5) * 6,
      y: (0.5 - px) * 6,
    })
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      className="w-full h-[60dvh] md:h-[70dvh] rounded-xl border bg-card overflow-hidden relative"
    >
      <Canvas camera={{ position: [2.5, 2.2, 2.5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          <Stars radius={40} depth={20} count={4000} factor={4} fade />
          <FloatingShapes />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} maxDistance={6} minDistance={2} />
      </Canvas>

      {/* Overlay content with typing intro */}
      <motion.div
        style={{ transform: `translateZ(0)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="absolute inset-0 pointer-events-none px-6 md:px-10 flex items-center"
      >
        <motion.div
          className="max-w-xl pointer-events-auto"
          style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          transition={spring}
        >
          <h1 className="text-balance text-2xl md:text-4xl font-semibold">
            <TypeWriter text={"Hi, I’m Tanvir — Full‑Stack Developer"} speed={28} />
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            I build fast, animated, and accessible web apps with Next.js, TypeScript, Tailwind CSS, and MongoDB — with a
            touch of 3D.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/projects"
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-95"
            >
              View Projects
            </a>
            <a href="/contact" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
              Contact Me
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Help hint */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <div className="rounded-full border bg-background/80 px-4 py-1 text-sm">Interactive 3D • Drag to orbit</div>
      </motion.div>
    </div>
  )
}
