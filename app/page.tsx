"use client"

import Link from "next/link"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Hero3D } from "@/components/hero-3d"
import { projects } from "@/data/projects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type BlogItem = { title: string; url: string; excerpt?: string; date?: string }
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HomePage() {
  const { data } = useSWR<{ items: BlogItem[] }>("/api/blogs", fetcher, { revalidateOnFocus: false })

  const highlight = projects.slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl space-y-10 md:space-y-14">
      <Hero3D />

      {/* About */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <div className="md:col-span-2 rounded-xl border bg-card p-6">
          <h2 className="text-2xl font-semibold">About</h2>
          <p className="mt-2 text-muted-foreground">
            I’m Tanvirahmad Vhora, a Full‑Stack Developer studying B.Tech IT at GCET (2022–2026). I craft delightful,
            performant interfaces and robust backends. Skills: HTML, CSS, JavaScript/TypeScript, React.js, Python, Web
            Development, Machine Learning & AI, and Data Engineering.
          </p>
          <ul className="mt-4 text-sm grid gap-2">
            <li>Education: B.Tech IT, GCET Anand (2022–2026)</li>
            <li>Experience: Front‑End Developer Intern, CodeAlpha (Jul–Aug 2024)</li>
            <li>Achievements: Top 5000 Finalist — Build With India Hackathon</li>
            <li>Responsibilities: IEEE GCET SB — certificate design, event branding</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-medium">Links</h3>
          <div className="mt-3 grid gap-2">
            <Button asChild size="sm" className="justify-start">
              <a href="mailto:vhoratanvir1610@gmail.com">Email</a>
            </Button>
            <Button asChild size="sm" variant="outline" className="justify-start bg-transparent">
              <a href="tel:+91916354686821">Phone</a>
            </Button>
            <Button asChild size="sm" variant="outline" className="justify-start bg-transparent">
              <a href="https://github.com/Tanvir1610" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button asChild size="sm" variant="outline" className="justify-start bg-transparent">
              <a href="https://protfolio-tanvir.vercel.app/" target="_blank" rel="noreferrer">
                Portfolio (ref)
              </a>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Projects preview */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="space-y-4"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <p className="text-muted-foreground text-sm">3D cards with motion and hover tilt.</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">See all</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlight.map((p) => (
            <Card key={p.href} className="group overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg border bg-muted" />
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm">
                    <a href={p.href} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </Button>
                  {p.source ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={p.source} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Blog preview */}
      <motion.section
        id="blog"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="space-y-4"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Blogs & Tutorials</h2>
            <p className="text-muted-foreground text-sm">Fetched from codewithtanvir.byethost5.com</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/blog">Open blog</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(data?.items || []).slice(0, 4).map((post) => (
            <Card key={post.url}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <a className="underline underline-offset-4" href={post.url} target="_blank" rel="noreferrer">
                    {post.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {post.excerpt || "Visit to read the full post."}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
      >
        <div className="rounded-xl border bg-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Let’s build something great</h2>
            <p className="text-muted-foreground mt-1">I’m open to freelance and full‑time roles.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/contact">Contact</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="/Tanvir_Vhora_Resume.pdf" target="_blank" rel="noreferrer">
                Resume
              </a>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
