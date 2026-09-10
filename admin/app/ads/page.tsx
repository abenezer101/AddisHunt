"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { AdStatusBadge, ProductMark } from "@/components/status-badge"
import {
  adCampaigns as seed,
  adSlots,
  placementLabel,
  type AdCampaign,
  type AdPlacement,
  type AdStatus,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icon } from "@iconify/react"

const filters: { id: "all" | AdStatus | AdPlacement; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "pending", label: "Pending" },
  { id: "scheduled", label: "Scheduled" },
  { id: "paused", label: "Paused" },
  { id: "promoted-top", label: "Promoted top" },
  { id: "homepage-banner", label: "Banners" },
  { id: "newsletter", label: "Newsletter" },
]

const emptyForm = {
  advertiser: "",
  product: "",
  placement: "promoted-top" as AdPlacement,
  start: "2026-09-11",
  end: "2026-09-17",
  destination: "https://",
  contact: "",
  creative: "",
}

function ctr(impressions: number, clicks: number) {
  if (!impressions) return "—"
  return `${((clicks / impressions) * 100).toFixed(1)}%`
}

function money(usd: number) {
  return `$${usd.toLocaleString()}`
}

export default function AdsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading promotions…</div>}>
      <AdsInner />
    </Suspense>
  )
}

function AdsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rows, setRows] = useState<AdCampaign[]>(seed)
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all")
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (searchParams.get("new") === "1") setOpen(true)
  }, [searchParams])

  const closeDialog = () => {
    setOpen(false)
    setForm(emptyForm)
    if (searchParams.get("new") === "1") router.replace("/ads")
  }

  const visible = useMemo(() => {
    return rows.filter((c) => {
      const q = query.trim().toLowerCase()
      const matches =
        !q ||
        c.advertiser.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q)
      if (!matches) return false
      if (filter === "all") return true
      if (filter === c.status || filter === c.placement) return true
      return false
    })
  }, [rows, filter, query])

  const liveRev = rows
    .filter((c) => c.status === "live")
    .reduce((sum, c) => sum + c.dailyRateUsd, 0)
  const pendingCount = rows.filter((c) => c.status === "pending").length
  const clicksToday = rows.filter((c) => c.status === "live").reduce((sum, c) => sum + c.clicks, 0)
  const impressionsToday = rows.filter((c) => c.status === "live").reduce((sum, c) => sum + c.impressions, 0)

  const patch = (id: string, next: Partial<AdCampaign>) => {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, ...next } : c)))
  }

  const create = () => {
    if (!form.advertiser.trim() || !form.product.trim()) return
    const slot = adSlots.find((s) => s.id === form.placement)
    const next: AdCampaign = {
      id: `ad-${Date.now()}`,
      advertiser: form.advertiser.trim(),
      product: form.product.trim(),
      placement: form.placement,
      status: "pending",
      start: form.start,
      end: form.end,
      dailyRateUsd: slot?.rateUsd ?? 199,
      impressions: 0,
      clicks: 0,
      destination: form.destination,
      creative: form.creative || "Creative pending",
      initials: form.advertiser.trim().slice(0, 2).toUpperCase(),
      accent: "#FF6154",
      contact: form.contact,
    }
    setRows((prev) => [next, ...prev])
    setFilter("pending")
    closeDialog()
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader
        title="Promotions"
        subtitle="Promoted placements, homepage banners, and newsletter sponsorships"
      />

      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-[#1A1815] text-[#FAF9F7] px-5 py-6 md:px-7">
          <div className="pointer-events-none absolute -right-8 -top-10 size-48 rounded-full bg-[#FF6154]/35 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6154]">
                Ad inventory · 10 Sep 2026
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {pendingCount === 0
                  ? "Every paid slot is booked or running."
                  : `${pendingCount} campaign${pendingCount === 1 ? "" : "s"} waiting on payment / creative.`}
              </h2>
              <p className="text-sm text-[#DBD6CC]">
                One promoted pin and one homepage banner per day. Newsletter is Thursday-only.
              </p>
            </div>
            <Button className="rounded-full bg-[#FF6154] text-white hover:bg-[#ff4f40] w-fit" onClick={() => setOpen(true)}>
              <Icon icon="solar:add-circle-linear" className="size-4" />
              New campaign
            </Button>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Live daily revenue" value={money(liveRev)} hint="Sum of running placements" />
          <Stat label="Impressions" value={impressionsToday.toLocaleString()} hint="Live campaigns only" />
          <Stat label="Clicks" value={clicksToday.toLocaleString()} hint={ctr(impressionsToday, clicksToday) + " CTR"} />
          <Stat label="Pending" value={String(pendingCount)} hint="Needs approve or invoice" accent />
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {adSlots.map((slot) => {
            const full = slot.filled >= slot.capacity
            return (
              <Card key={slot.id} className="shadow-none border-border/80">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{slot.name}</CardTitle>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        full
                          ? "bg-[#FF6154]/12 text-[#c2410c]"
                          : "bg-emerald-500/10 text-emerald-700"
                      }`}
                    >
                      {slot.filled}/{slot.capacity} {full ? "sold" : "open"}
                    </span>
                  </div>
                  <CardDescription>{slot.where}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{slot.description}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{slot.rate}</span>
                    <span className="text-[11px] text-muted-foreground">{money(slot.rateUsd)} / {slot.period}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

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
            placeholder="Search advertiser or product"
            className="h-9 max-w-xs rounded-full bg-background"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Perf</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ProductMark initials={c.initials} accent={c.accent} />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.product}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {c.advertiser} · {c.contact}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{placementLabel[c.placement]}</div>
                    <div className="max-w-[180px] truncate text-xs text-muted-foreground">{c.creative}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {c.start} → {c.end}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{money(c.dailyRateUsd)}</TableCell>
                  <TableCell className="text-sm">
                    <div>{c.impressions.toLocaleString()} imp</div>
                    <div className="text-xs text-muted-foreground">
                      {c.clicks.toLocaleString()} clk · {ctr(c.impressions, c.clicks)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AdStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {c.status === "pending" ? (
                        <>
                          <Button size="xs" className="rounded-full" onClick={() => patch(c.id, { status: "scheduled" })}>
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => patch(c.id, { status: "ended" })}
                          >
                            Decline
                          </Button>
                        </>
                      ) : null}
                      {c.status === "live" ? (
                        <Button size="xs" variant="outline" className="rounded-full" onClick={() => patch(c.id, { status: "paused" })}>
                          Pause
                        </Button>
                      ) : null}
                      {c.status === "paused" || c.status === "scheduled" ? (
                        <Button size="xs" className="rounded-full" onClick={() => patch(c.id, { status: "live" })}>
                          Go live
                        </Button>
                      ) : null}
                      {c.status === "live" || c.status === "paused" ? (
                        <Button size="xs" variant="ghost" className="rounded-full" onClick={() => patch(c.id, { status: "ended" })}>
                          End
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No campaigns for that filter.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (next) setOpen(true)
          else closeDialog()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New campaign</DialogTitle>
            <DialogDescription>Sits in pending until you approve it. Click outside to close.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-2">
            <Field
              label="Advertiser"
              value={form.advertiser}
              onChange={(v) => setForm({ ...form, advertiser: v })}
              placeholder="Prepl"
            />
            <Field
              label="Product"
              value={form.product}
              onChange={(v) => setForm({ ...form, product: v })}
              placeholder="Prepl Launch"
            />

            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Placement
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {adSlots.map((s) => {
                  const active = form.placement === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm({ ...form, placement: s.id })}
                      className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-[#1A1815] bg-[#1A1815] text-[#FAF9F7]"
                          : "border-border bg-white hover:bg-muted/60"
                      }`}
                    >
                      <div className="text-xs font-semibold leading-tight">{s.name}</div>
                      <div className={`mt-0.5 text-[11px] ${active ? "text-white/70" : "text-muted-foreground"}`}>
                        {money(s.rateUsd)} / {s.period}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Field label="Starts" type="date" value={form.start} onChange={(v) => setForm({ ...form, start: v })} />
            <Field label="Ends" type="date" value={form.end} onChange={(v) => setForm({ ...form, end: v })} />
            <Field
              label="Destination URL"
              value={form.destination}
              onChange={(v) => setForm({ ...form, destination: v })}
              placeholder="https://"
            />
            <Field
              label="Billing email"
              value={form.contact}
              onChange={(v) => setForm({ ...form, contact: v })}
              placeholder="ads@company.com"
            />
            <div className="sm:col-span-2">
              <Field
                label="Creative notes"
                value={form.creative}
                onChange={(v) => setForm({ ...form, creative: v })}
                placeholder="Optional — banner copy or filename"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-[#1A1815] text-[#FAF9F7] hover:bg-[#1A1815]/90"
              onClick={create}
              disabled={!form.advertiser.trim() || !form.product.trim()}
            >
              Create campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string
  hint: string
  accent?: boolean
}) {
  return (
    <Card className={`shadow-none border-border/80 ${accent ? "bg-[#FF6154]/8 border-[#FF6154]/20" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-xl bg-white"
      />
    </label>
  )
}
