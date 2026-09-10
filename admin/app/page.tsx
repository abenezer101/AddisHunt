"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { ProductMark, ProductStatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { comments as seedComments, kpis, products as seedProducts, type Product } from "@/lib/data"
import { Icon } from "@iconify/react"

export default function DashboardPage() {
  const [queue, setQueue] = useState<Product[]>(() =>
    seedProducts.filter((p) => p.status === "pending" || p.status === "scheduled")
  )
  const live = useMemo(
    () => seedProducts.filter((p) => p.status === "live").sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)),
    []
  )
  const flagged = seedComments.filter((c) => c.status === "flagged")

  const decide = (id: string, status: Product["status"]) => {
    setQueue((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)).filter((p) => p.status === "pending" || p.status === "scheduled"))
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Today’s hunt" subtitle="Thursday 10 Sep 2026 · 12:01 AM EAT window" />

      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-[#1A1815] text-[#FAF9F7] px-5 py-6 md:px-7 md:py-7">
          <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-[#FF6154]/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-24 size-40 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6154]">Launch day · Addis Ababa</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Four products on the board. Two still waiting on you.</h2>
              <p className="text-sm text-[#DBD6CC]">
                Review pending submissions before midnight EAT so they ship in tomorrow’s hunt, not next week’s archive.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button render={<Link href="/products?filter=pending" />} className="rounded-full bg-[#FF6154] text-white hover:bg-[#ff4f40]">
                Review queue
              </Button>
              <Button variant="outline" render={<Link href="/ads" />} className="rounded-full border-white/15 bg-white/5 text-[#FAF9F7] hover:bg-white/10">
                Promotions
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Live today" value={String(kpis.liveToday)} hint={kpis.liveDelta} icon="solar:rocket-linear" />
          <Kpi label="Pending review" value={String(kpis.pendingReview)} hint={kpis.pendingDelta} icon="solar:hourglass-line-linear" accent />
          <Kpi label="Upvotes today" value={kpis.upvotesToday.toLocaleString()} hint={kpis.upvoteDelta} icon="solar:round-alt-arrow-up-linear" />
          <Kpi label="New hunters" value={String(kpis.newHunters)} hint={kpis.hunterDelta} icon="solar:users-group-rounded-linear" />
        </section>

        <section className="grid gap-4 xl:grid-cols-5">
          <Card className="xl:col-span-3 border-border/80 shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Hunt board</CardTitle>
                <CardDescription>Ranked live launches for 10 Sep 2026</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/products" />}>
                Manage
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {live.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5"
                >
                  <div className="w-7 text-center font-mono text-sm font-semibold text-muted-foreground">
                    {p.rank}
                  </div>
                  <ProductMark initials={p.initials} accent={p.accent} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{p.name}</span>
                      {p.promoted ? (
                        <span className="rounded-full bg-[#FF6154]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c2410c]">
                          Promoted
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{p.tagline}</p>
                  </div>
                  <div className="hidden items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold sm:flex">
                    <span className="upvote-tri text-[#FF6154]" />
                    {p.votes}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="xl:col-span-2 border-border/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Launch queue</CardTitle>
              <CardDescription>Approve to ship at 12:01 AM EAT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {queue.length === 0 ? (
                <p className="text-sm text-muted-foreground">Queue is clear. Nice work.</p>
              ) : (
                queue.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border/70 p-3 space-y-3">
                    <div className="flex items-start gap-3">
                      <ProductMark initials={p.initials} accent={p.accent} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">{p.name}</span>
                          <ProductStatusBadge status={p.status} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{p.tagline}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {p.maker} · {p.launchDate}
                        </p>
                      </div>
                    </div>
                    {p.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 rounded-full" onClick={() => decide(p.id, "scheduled")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => decide(p.id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">Scheduled · no action needed</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/80 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Moderation</CardTitle>
              <CardDescription>Flagged discussion that needs a human</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/comments" />}>
              Open inbox
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flagged.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.author}</TableCell>
                      <TableCell>{c.product}</TableCell>
                      <TableCell className="max-w-sm truncate text-muted-foreground">{c.body}</TableCell>
                      <TableCell className="text-amber-800">{c.reason}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{c.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string
  value: string
  hint: string
  icon: string
  accent?: boolean
}) {
  return (
    <Card className={`shadow-none border-border/80 ${accent ? "bg-[#FF6154]/8 border-[#FF6154]/20" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
        <Icon icon={icon} className={`size-4 ${accent ? "text-[#FF6154]" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}
