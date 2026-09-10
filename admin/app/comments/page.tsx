"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { CommentStatusBadge } from "@/components/status-badge"
import { comments as seed, type AdminComment, type CommentStatus } from "@/lib/data"
import { Button } from "@/components/ui/button"

const filters: Array<"all" | CommentStatus> = ["all", "flagged", "visible", "hidden"]

export default function CommentsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("flagged")
  const [rows, setRows] = useState<AdminComment[]>(seed)

  const visible = useMemo(
    () => rows.filter((c) => (filter === "all" ? true : c.status === filter)),
    [rows, filter]
  )

  const setStatus = (id: string, status: CommentStatus) => {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Comments" subtitle="Keep discussion useful. Hide spam, keep the heat." />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === f ? "bg-[#1A1815] text-[#FAF9F7]" : "border border-border bg-background hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visible.map((c) => (
            <article key={c.id} className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="font-semibold">{c.author}</span>
                  <span className="text-muted-foreground"> on </span>
                  <span className="font-medium">{c.product}</span>
                  <span className="text-muted-foreground"> · {c.time}</span>
                </div>
                <CommentStatusBadge status={c.status} />
              </div>
              <p className="text-sm leading-relaxed">{c.body}</p>
              {c.reason ? (
                <p className="text-xs text-amber-800 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 w-fit">
                  Flagged: {c.reason}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button size="xs" className="rounded-full" onClick={() => setStatus(c.id, "visible")}>
                  Keep
                </Button>
                <Button size="xs" variant="outline" className="rounded-full" onClick={() => setStatus(c.id, "hidden")}>
                  Hide
                </Button>
                <Button
                  size="xs"
                  variant="destructive"
                  className="rounded-full"
                  onClick={() => setRows((prev) => prev.filter((row) => row.id !== c.id))}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Inbox is empty for this filter.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  )
}
