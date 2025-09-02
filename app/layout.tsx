import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"

export const metadata: Metadata = {
  title: "Tanvir — Full‑Stack Developer",
  description: "Animated full‑stack portfolio. Next.js, TypeScript, Tailwind CSS, Framer Motion, MongoDB.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-dvh bg-background text-foreground antialiased font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div>Loading...</div>}>
            <SiteHeader />
            <PageTransition>
              <main className="px-4 md:px-6 py-6">{children}</main>
            </PageTransition>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
