"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { categories as seed, type Category } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@iconify/react"

export default function CategoriesPage() {
  const [rows, setRows] = useState<Category[]>(seed)

  const toggle = (id: string) => {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)))
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Categories" subtitle="What shows in Best Products and the homepage chips" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <Card key={c.id} className="shadow-none border-border/80">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">{c.name}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px]">{c.products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">/{c.slug}</span>
                  <Button
                    size="xs"
                    variant={c.featured ? "secondary" : "outline"}
                    className="rounded-full"
                    onClick={() => toggle(c.id)}
                  >
                    <Icon icon={c.featured ? "solar:star-bold" : "solar:star-linear"} className="size-3.5" />
                    {c.featured ? "Featured" : "Feature"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
