"use client"

import { projects } from "@/data/projects"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/project-card"

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">Projects</h1>
        <p className="text-muted-foreground mt-2">
          Selected projects showcasing full-stack skills, performance, and delightful UX.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p) => (
          <ProjectCard key={p.href} {...p} />
        ))}
      </motion.div>
    </div>
  )
}
