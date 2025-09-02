"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRef, useState, type MouseEvent } from "react"

export function ProjectCard({
  title,
  stack,
  href,
  description,
}: {
  title: string
  stack: string
  href: string
  description: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const rotation = 8 // max degrees

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * rotation // rotateX inversely with y
    const ry = (px - 0.5) * rotation // rotateY with x
    setTilt({ x: rx, y: ry })
  }
  function handleLeave() {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: tilt.x, rotateY: tilt.y, transformPerspective: 900 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="will-change-transform"
    >
      <Card className="h-full flex flex-col ring-1 ring-transparent hover:ring-primary/30 transition">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="text-xs text-muted-foreground">{stack}</div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
        <CardFooter className="mt-auto">
          <Button asChild>
            <Link href={href} target="_blank" rel="noreferrer">
              View on GitHub
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
