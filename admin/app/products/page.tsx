"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ProductMark, ProductStatusBadge } from "@/components/status-badge"
import { products as seed, type Product, type ProductStatus } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icon } from "@iconify/react"

const filters: { id: "all" | ProductStatus | "featured" | "promoted"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "pending", label: "Pending" },
  { id: "scheduled", label: "Scheduled" },
  { id: "featured", label: "Featured" },
  { id: "promoted", label: "Promoted" },
  { id: "rejected", label: "Rejected" },
]

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading products…</div>}>
      <ProductsInner />
    </Suspense>
  )
}

function ProductsInner() {
  const searchParams = useSearchParams()
  const initial = (searchParams.get("filter") as (typeof filters)[number]["id"]) || "all"
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>(
    filters.some((f) => f.id === initial) ? initial : "all"
  )
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState<Product[]>(seed)

  const visible = useMemo(() => {
    return rows.filter((p) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.maker.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      if (!matchesQuery) return false
      if (filter === "all") return true
      if (filter === "featured") return p.featured
      if (filter === "promoted") return p.promoted
      return p.status === filter
    })
  }, [rows, filter, query])

  const patch = (id: string, next: Partial<Product>) => {
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, ...next } : p)))
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Products" subtitle="Approve launches, feature homepage slots, sell promoted placement" />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.id
                    ? "bg-[#1A1815] text-[#FAF9F7]"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, maker, category"
            className="h-9 max-w-xs rounded-full bg-background"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ProductMark initials={p.initials} accent={p.accent} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium">{p.name}</span>
                          {p.featured ? (
                            <Icon icon="solar:star-bold" className="size-3.5 text-amber-500" />
                          ) : null}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{p.tagline}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell className="text-sm">{p.maker}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      <span className="upvote-tri text-[#FF6154]" />
                      {p.votes}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ProductStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {p.status === "pending" ? (
                        <>
                          <Button size="xs" className="rounded-full" onClick={() => patch(p.id, { status: "scheduled" })}>
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => patch(p.id, { status: "rejected" })}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="xs"
                            variant={p.featured ? "secondary" : "outline"}
                            className="rounded-full"
                            onClick={() => patch(p.id, { featured: !p.featured })}
                          >
                            {p.featured ? "Unfeature" : "Feature"}
                          </Button>
                          <Button
                            size="xs"
                            variant={p.promoted ? "default" : "outline"}
                            className="rounded-full"
                            onClick={() => patch(p.id, { promoted: !p.promoted })}
                          >
                            {p.promoted ? "Promoted" : "Promote"}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Nothing matches that filter.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
