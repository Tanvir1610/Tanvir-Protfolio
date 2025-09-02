"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo, useRef, useEffect, useState } from "react"

type BlogItem = {
  title: string
  url: string
  excerpt?: string
  date?: string
  category?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR<{ items: BlogItem[] }>("/api/blogs", fetcher, {
    revalidateOnFocus: false,
  })

  const items = data?.items || []

  // Derive categories from item.category if present, otherwise hostname fallback
  const categories = useMemo(() => {
    const set = new Set<string>(["All"])
    for (const it of items) {
      let cat = it.category
      if (!cat) {
        try {
          const u = new URL(it.url)
          cat = u.hostname.replace(/^www\./, "")
        } catch {
          cat = "Other"
        }
      }
      set.add(cat)
    }
    return Array.from(set)
  }, [items])

  const [active, setActive] = useState("All")
  const filtered = useMemo(() => {
    if (active === "All") return items
    return items.filter((it) => {
      if (it.category) return it.category === active
      try {
        const host = new URL(it.url).hostname.replace(/^www\./, "")
        return host === active
      } catch {
        return false
      }
    })
  }, [active, items])

  // infinite scroll (progressively reveal)
  const [visible, setVisible] = useState(8)
  const sentinel = useRef<HTMLDivElement | null>(null)
  useEffect(() => setVisible(8), [active])
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) setVisible((v) => Math.min(v + 6, filtered.length))
      })
    })
    io.observe(el)
    return () => io.disconnect()
  }, [filtered.length])

  return (
    <div className="mx-auto max-w-6xl py-10 md:py-14">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Blogs & Tutorials</h1>
        <p className="text-muted-foreground mt-2">Content fetched from my external articles and curated tutorials.</p>
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-md border px-3 py-1.5 text-sm ${active === c ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">Failed to load blog posts.</p>}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="text-muted-foreground">No posts found. Try switching categories.</p>
      )}

      {!!filtered.length && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {filtered.slice(0, visible).map((post) => (
              <Card key={post.url} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link className="underline underline-offset-4" href={post.url} target="_blank" rel="noreferrer">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {post.excerpt || "Visit to read/view the full content."}
                  {post.date ? <div className="mt-2 text-xs opacity-70">{post.date}</div> : null}
                </CardContent>
              </Card>
            ))}
          </motion.div>
          <div ref={sentinel} className="h-8" />
        </>
      )}
    </div>
  )
}
