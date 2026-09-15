"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { createAnonSupabaseClient, type Database } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icon } from "@iconify/react"

const defaultCategories = [
  { name: "Fintech", slug: "fintech", description: "Payments, banking, micro-finance & digital wallets" },
  { name: "AI & ML", slug: "ai-ml", description: "Artificial intelligence models, agents & automation" },
  { name: "Developer Tools", slug: "developer-tools", description: "APIs, SDKs, dev infrastructure & CLI tools" },
  { name: "Agritech", slug: "agritech", description: "Agricultural supply chain, farming sensors & market access" },
  { name: "Healthtech", slug: "healthtech", description: "Telemedicine, health records & medical logistics" },
  { name: "E-commerce", slug: "e-commerce", description: "Online marketplaces, retail & direct-to-consumer tech" },
  { name: "Logistics", slug: "logistics", description: "Last-mile delivery, fleet tracking & freight services" },
  { name: "Edtech", slug: "edtech", description: "Learning platforms, skills development & schooling tools" },
  { name: "Productivity", slug: "productivity", description: "Workplace collaboration, notes & workflow software" },
  { name: "Clean Energy", slug: "clean-energy", description: "Solar power, renewables & climate solutions" },
]

type Startup = Database["public"]["Tables"]["startups"]["Row"]

export default function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const supabase = createAnonSupabaseClient()
        const { data, error } = await supabase.from("startups").select("categories")

        if (!error && data) {
          const tally: Record<string, number> = {}
          data.forEach((row) => {
            if (Array.isArray(row.categories)) {
              row.categories.forEach((cat) => {
                const normalized = cat.trim()
                tally[normalized] = (tally[normalized] || 0) + 1
              })
            }
          })
          setCounts(tally)
        }
      } catch (err) {
        console.error("Failed to fetch category counts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  const visible = useMemo(() => {
    return defaultCategories.filter((c) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    })
  }, [query])

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader
        title="Categories"
        subtitle="Explore ecosystem verticals and actual live product counts from Supabase"
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-muted-foreground">
            Total Categories: <span className="text-foreground font-bold">{defaultCategories.length}</span>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search category name or description..."
            className="h-9 max-w-xs rounded-full bg-background"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => {
            const count = counts[c.name] || 0
            return (
              <Card key={c.slug} className="shadow-none border-border/80 hover:border-border transition-colors">
                <CardContent className="p-4 flex flex-col justify-between gap-3 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                        <Icon icon="solar:tag-linear" className="size-4 text-muted-foreground" />
                        {c.name}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold text-foreground shrink-0">
                      {loading ? "…" : `${count} products`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                      /{c.slug}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {count > 0 ? "Active Vertical" : "Ready for launches"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
