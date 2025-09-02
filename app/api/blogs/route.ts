import { NextResponse } from "next/server"

// Attempt to fetch basic metadata from a URL (title, description, date). Time out quickly to keep API snappy.
async function fetchMeta(url: string): Promise<Partial<{ title: string; excerpt: string; date: string }>> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; TanvirPortfolioBot/1.0)" },
      signal: ctrl.signal,
      cache: "no-store",
    })
    clearTimeout(t)
    const html = await res.text()
    const pick = (prop: string, name = "property") => {
      const m =
        html.match(new RegExp(`<meta[^>]+${name}=["']${prop}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i")) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${name}=["']${prop}["'][^>]*>`, "i"))
      return m?.[1]
    }
    const title =
      pick("og:title") || pick("twitter:title") || (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "").trim()
    const excerpt =
      pick("og:description") ||
      pick("twitter:description") ||
      (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || "").trim()
    const date =
      pick("article:published_time") ||
      pick("datePublished", "itemprop") ||
      html.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ||
      undefined
    return { title, excerpt, date }
  } catch {
    return {}
  }
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "")
}

// Curated links provided by you as a reliable fallback
const curated = [
  {
    title: "Best Practices for C++ Memory Management",
    url: "https://medium.com/@codewithtanvir/best-practices-for-c-memory-management-avoid-memory-leaks-optimize-performance-11a135b5e2bc",
    category: "Articles",
  },
  {
    title: "Modern JavaScript ES6+ Features You Should Know",
    url: "https://medium.com/@codewithtanvir/modern-javascript-es6-features-you-should-know-34662ef0954b",
    category: "Articles",
  },
  {
    title: "Building Responsive Layouts with CSS Grid",
    url: "https://medium.com/@codewithtanvir/building-responsive-layouts-with-css-grid-e0db231cb5e3",
    category: "Articles",
  },
  {
    title: "Data Structures: When to Use What",
    url: "https://medium.com/@codewithtanvir/data-structures-when-to-use-what-b14aeaadafe5",
    category: "Articles",
  },
  {
    title: "C++ Fundamentals (Playlist)",
    url: "https://www.youtube.com/playlist?list=PL3ZewXBEAMgcdt7lsFU8fn3SSgkt1k3FY",
    category: "Tutorials",
  },
  {
    title: "Advance C++ Concept",
    url: "https://www.youtube.com/watch?v=8Bd7VAYBSE4",
    category: "Tutorials",
  },
  {
    title: "C Programming Basics (Playlist)",
    url: "https://www.youtube.com/playlist?list=PL3ZewXBEAMgcBQ33SbhoVoNMIu74yHJZg",
    category: "Tutorials",
  },
  {
    title: "HTML & CSS Essentials (Playlist)",
    url: "https://www.youtube.com/playlist?list=PL3ZewXBEAMgdzUJG32at2oTyDIp8t-VG_",
    category: "Tutorials",
  },
  {
    title: "JavaScript Fundamentals",
    url: "https://www.youtube.com/watch?si=I9yCs73Jvc-IbhRS&v=bnASZOTXwjo&feature=youtu.be",
    category: "Tutorials",
  },
]

export async function GET() {
  try {
    // 1) Try to scrape the byethost page as before
    let items: Array<{ title: string; url: string; excerpt?: string; date?: string; category?: string }> = []
    try {
      const res = await fetch("https://codewithtanvir.byethost5.com/?i=1", {
        cache: "no-store",
        headers: { "user-agent": "Mozilla/5.0 (compatible; TanvirPortfolioBot/1.0)" },
      })
      const html = await res.text()
      const anchors = Array.from(html.matchAll(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi))
      items = anchors
        .map((m) => {
          const rawUrl = m[1]
          const url = rawUrl.startsWith("http")
            ? rawUrl
            : `https://codewithtanvir.byethost5.com/${rawUrl.replace(/^\//, "")}`
          const title = stripTags(m[2]).trim()
          const after = html.slice((m.index || 0) + m[0].length, (m.index || 0) + m[0].length + 240)
          const excerpt = stripTags(after).replace(/\s+/g, " ").slice(0, 140).trim()
          const dateMatch = after.match(/\b(?:\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|\d{4}-\d{2}-\d{2})\b/)
          const date = dateMatch?.[0]
          return { title, url, excerpt: excerpt || undefined, date }
        })
        .filter((i) => i.title && i.title.length > 6)
        .slice(0, 40)
    } catch (e) {
      console.log("[v0] blogs: primary fetch failed, will use curated fallback")
    }

    // 2) Enrich curated links with metadata in parallel, but do not block on failures
    const enriched = await Promise.all(
      curated.map(async (c) => {
        const meta = await fetchMeta(c.url)
        return {
          title: meta.title?.trim() || c.title,
          url: c.url,
          excerpt: meta.excerpt?.trim(),
          date: meta.date,
          category: c.category,
        }
      }),
    )

    // 3) Merge and de-duplicate by URL, prefer enriched curated data
    const map = new Map<string, { title: string; url: string; excerpt?: string; date?: string; category?: string }>()
    for (const it of items) map.set(it.url, it)
    for (const it of enriched) map.set(it.url, it) // curated overwrites duplicates

    const final = Array.from(map.values())
    if (!final.length) {
      console.log("[v0] blogs: returning curated-only list")
    }
    return NextResponse.json({ items: final })
  } catch (e) {
    console.error("[v0] blogs: unexpected error", (e as Error).message)
    return NextResponse.json({ items: [], error: "failed_to_fetch" }, { status: 500 })
  }
}
