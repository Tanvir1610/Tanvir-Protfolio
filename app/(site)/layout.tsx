import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="px-4 md:px-6 lg:px-8">{children}</main>
    </div>
  )
}
