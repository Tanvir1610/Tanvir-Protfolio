"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blogs" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 md:px-6 py-3">
        <Link href="/" className="font-semibold">
          Tanvir.dev
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <motion.div
              key={l.href}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  pathname === l.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden bg-transparent"
            aria-label="Open navigation"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden border-t bg-background"
          >
            <div className="mx-auto max-w-6xl px-4 py-3 grid gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    pathname === l.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
