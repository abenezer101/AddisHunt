"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import { createAnonSupabaseClient, createClerkSupabaseClient, type Database } from "@/lib/supabaseClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"

type Startup = Database["public"]["Tables"]["startups"]["Row"]

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [startups, setStartups] = useState<Startup[]>([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const supabase = createAnonSupabaseClient()
      const [{ data: startupsData }, { count }] = await Promise.all([
        supabase.from("startups").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
      ])

      if (startupsData) setStartups(startupsData)
      if (count !== null) setCommentsCount(count)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const queue = useMemo(() => startups.filter((s) => s.status === "pending"), [startups])
  const live = useMemo(() => startups.filter((s) => s.status === "approved"), [startups])
  const totalVotes = useMemo(() => startups.reduce((acc, s) => acc + (s.votes_count || 0), 0), [startups])

  const decide = async (id: string, status: "approved" | "rejected") => {
    setActionLoadingId(id)
    try {
      const token = (await getToken({ template: "supabase" }).catch(() => null)) || (await getToken())
      const supabase = createClerkSupabaseClient(token)
      const { error } = await supabase.from("startups").update({ status }).eq("id", id)

      if (!error) {
        setStartups((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
      }
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Today’s hunt" subtitle="Addis Hunt Admin Dashboard" />

      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-[#1A1815] text-[#FAF9F7] px-5 py-6 md:px-7 md:py-7">
          <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-[#FF6154]/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-24 size-40 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6154]">Launch Queue</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {queue.length} {queue.length === 1 ? "product" : "products"} waiting for review.
              </h2>
              <p className="text-sm text-[#DBD6CC]">
                Moderate new startups before they appear publicly on the Addis Hunt feed.
              </p>
            </div>
            <Link href="/products?filter=pending">
              <Button size="sm" className="bg-[#FF6154] hover:bg-[#e05347] text-white rounded-full font-semibold px-4 cursor-pointer">
                View Queue
              </Button>
            </Link>
          </div>
        </section>

        {/* Real Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-none border-border/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Products</p>
                <h3 className="text-2xl font-bold font-display mt-1">{loading ? "…" : startups.length}</h3>
              </div>
              <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Icon icon="solar:box-linear" className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Review</p>
                <h3 className="text-2xl font-bold font-display mt-1 text-amber-600">{loading ? "…" : queue.length}</h3>
              </div>
              <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Icon icon="solar:rocket-linear" className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Approved Live</p>
                <h3 className="text-2xl font-bold font-display mt-1 text-emerald-600">{loading ? "…" : live.length}</h3>
              </div>
              <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Icon icon="solar:check-circle-bold" className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Upvotes</p>
                <h3 className="text-2xl font-bold font-display mt-1 text-[#FF6154]">{loading ? "…" : totalVotes}</h3>
              </div>
              <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-[#FF6154]">
                <Icon icon="solar:arrow-up-linear" className="size-5" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Hunt Board & Queue Cards */}
        <section className="grid gap-4 xl:grid-cols-5">
          <Card className="xl:col-span-3 border-border/80 shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Hunt Board</CardTitle>
                <CardDescription>Live approved startups on Addis Hunt</CardDescription>
              </div>
              <Link href="/products?filter=approved">
                <Button size="xs" variant="outline" className="rounded-full cursor-pointer text-xs">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                ))
              ) : live.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No live approved startups in the database yet.</p>
              ) : (
                live.slice(0, 8).map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3 hover:border-border transition-colors"
                  >
                    <div className="w-6 text-center font-mono text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </div>
                    <div className="relative size-9 rounded-lg overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center font-bold text-xs">
                      {p.logo_url ? (
                        <Image src={p.logo_url} alt={p.name} fill className="object-cover" sizes="36px" />
                      ) : (
                        <span>{p.name?.[0]?.toUpperCase() ?? "?"}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{p.name}</span>
                        {p.categories?.[0] && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {p.categories[0]}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{p.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#FF6154] bg-red-500/10 px-2 py-1 rounded-md">
                      <Icon icon="solar:arrow-up-linear" className="size-3" />
                      {p.votes_count}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-2 border-border/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Review Queue</CardTitle>
              <CardDescription>Approve or reject submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))
              ) : queue.length === 0 ? (
                <div className="text-center py-10 space-y-1">
                  <Icon icon="solar:check-circle-bold" className="size-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Queue is clean!</p>
                  <p className="text-xs text-muted-foreground">No pending submissions awaiting review.</p>
                </div>
              ) : (
                queue.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="relative size-10 rounded-xl overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center font-bold text-sm">
                        {p.logo_url ? (
                          <Image src={p.logo_url} alt={p.name} fill className="object-cover" sizes="40px" />
                        ) : (
                          <span>{p.name?.[0]?.toUpperCase() ?? "?"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">{p.name}</span>
                          <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            Pending
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.tagline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1 border-t border-border/50">
                      <Button
                        size="xs"
                        className="flex-1 rounded-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        disabled={actionLoadingId === p.id}
                        onClick={() => decide(p.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        className="flex-1 rounded-full cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-medium"
                        disabled={actionLoadingId === p.id}
                        onClick={() => decide(p.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
