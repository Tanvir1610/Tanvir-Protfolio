"use client"

import { Hero3D } from "@/components/hero-3d"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="relative">
        <Hero3D />
        <div className="mx-auto max-w-3xl text-center -mt-16 md:-mt-24">
          <h1 className="text-balance text-3xl md:text-5xl font-semibold tracking-tight">
            Tanvir — Full‑Stack Developer building modern, animated, and scalable web apps
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg leading-relaxed">
            Next.js, TypeScript, Tailwind CSS, Framer Motion, MongoDB. I craft responsive experiences with clean code,
            smooth animations, and a strong 3D feel.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="grid gap-6 md:grid-cols-3"
        >
          <Stat title="Production Deploys" value="10+" />
          <Stat title="Years Experience" value="2+" />
          <Stat title="Tech Stack" value="Next.js · TS · MongoDB" />
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
          className="rounded-xl border p-6 md:p-8 bg-card"
        >
          <h2 className="text-2xl md:text-3xl font-semibold">Featured Work</h2>
          <p className="mt-2 text-muted-foreground">
            Explore a selection of projects demonstrating full-stack expertise, UI polish, and performance.
          </p>
          <div className="mt-6">
            <Link className="underline underline-offset-4" href="/projects">
              See all projects →
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}
