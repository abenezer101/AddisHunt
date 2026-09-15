"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { PageHeader } from "@/components/page-header"
import { createAnonSupabaseClient, createClerkSupabaseClient, type Database } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icon } from "@iconify/react"

type Startup = Database["public"]["Tables"]["startups"]["Row"]

const filters = [
  { id: "all", label: "All Products" },
  { id: "approved", label: "Live / Approved" },
  { id: "pending", label: "Pending Review" },
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
  const { getToken } = useAuth()
  const initial = searchParams.get("filter") || "all"
  const [filter, setFilter] = useState<string>(
    filters.some((f) => f.id === initial) ? initial : "all"
  )
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const supabase = createAnonSupabaseClient()
      const { data, error } = await supabase
        .from("startups")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setProducts(data)
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const visible = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.categories && p.categories.some((cat) => cat.toLowerCase().includes(q)))

      if (!matchesQuery) return false
      if (filter === "all") return true
      return p.status === filter
    })
  }, [products, filter, query])

  const updateStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
    setActionLoadingId(id)
    setActionError(null)
    try {
      const token = (await getToken({ template: "supabase" }).catch(() => null)) || (await getToken())
      const supabase = createClerkSupabaseClient(token)
      const { data, error } = await supabase.from("startups").update({ status }).eq("id", id).select("id")

      if (error) throw new Error(error.message)
      if (!data || data.length === 0) {
        throw new Error("Update blocked by database permissions — your account is not in the admins list.")
      }
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    } catch (err) {
      console.error("Failed to update status:", err)
      setActionError(err instanceof Error ? err.message : "Failed to update status. Please try again.")
    } finally {
      setActionLoadingId(null)
    }
  }

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return

    setActionLoadingId(id)
    setActionError(null)
    try {
      const token = (await getToken({ template: "supabase" }).catch(() => null)) || (await getToken())
      const supabase = createClerkSupabaseClient(token)
      const { data, error } = await supabase.from("startups").delete().eq("id", id).select("id")

      if (error) throw new Error(error.message)
      if (!data || data.length === 0) {
        throw new Error("Delete blocked by database permissions — your account is not in the admins list.")
      }
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Failed to delete product:", err)
      setActionError(err instanceof Error ? err.message : "Failed to delete product. Please try again.")
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader
        title="Products"
        subtitle="Manage product submissions, review queue, and live startups"
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  filter === f.id
                    ? "bg-[#1A1815] text-[#FAF9F7]"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {f.label}{" "}
                <span className="opacity-70 font-mono text-[11px]">
                  (
                  {f.id === "all"
                    ? products.length
                    : products.filter((p) => p.status === f.id).length}
                  )
                </span>
              </button>
            ))}
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, tagline, or category..."
            className="h-9 max-w-xs rounded-full bg-background"
          />
        </div>

        {actionError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Launch Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="py-4">
                      <div className="h-6 rounded bg-muted animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No products found matching this filter.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 rounded-xl overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center font-display font-bold text-sm">
                          {p.logo_url ? (
                            <Image
                              src={p.logo_url}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <span>{p.name?.[0]?.toUpperCase() ?? "?"}</span>
                          )}
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold">{p.name}</span>
                            {p.url && (
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                                title="Visit website"
                              >
                                <Icon icon="solar:export-linear" className="size-3" />
                              </a>
                            )}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{p.tagline}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.categories?.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium"
                          >
                            {cat}
                          </span>
                        )) ?? <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold">
                        <Icon icon="solar:arrow-up-linear" className="size-3 text-[#FF6154]" />
                        {p.votes_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.launch_date || (p.created_at ? new Date(p.created_at).toLocaleDateString() : "—")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          p.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : p.status === "rejected"
                            ? "bg-red-500/10 text-red-600 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {p.status ?? "pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        {p.status !== "approved" && (
                          <Button
                            size="xs"
                            className="rounded-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={actionLoadingId === p.id}
                            onClick={() => updateStatus(p.id, "approved")}
                          >
                            Approve
                          </Button>
                        )}
                        {p.status !== "rejected" && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="rounded-full cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            disabled={actionLoadingId === p.id}
                            onClick={() => updateStatus(p.id, "rejected")}
                          >
                            Reject
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="ghost"
                          className="rounded-full cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={actionLoadingId === p.id}
                          onClick={() => deleteProduct(p.id, p.name)}
                          title="Delete product"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
