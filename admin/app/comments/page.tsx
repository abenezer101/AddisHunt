"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { createAnonSupabaseClient, createClerkSupabaseClient, type Database } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icon } from "@iconify/react"

type Comment = Database["public"]["Tables"]["comments"]["Row"]
type Startup = Database["public"]["Tables"]["startups"]["Row"]

export default function CommentsPage() {
  const { getToken } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [startupsMap, setStartupsMap] = useState<Record<string, string>>({})
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const supabase = createAnonSupabaseClient()
      const [{ data: commentsData }, { data: startupsData }] = await Promise.all([
        supabase.from("comments").select("*").order("created_at", { ascending: false }),
        supabase.from("startups").select("id, name"),
      ])

      if (commentsData) setComments(commentsData)
      if (startupsData) {
        const map: Record<string, string> = {}
        startupsData.forEach((s) => {
          map[s.id] = s.name
        })
        setStartupsMap(map)
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const visible = useMemo(() => {
    return comments.filter((c) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      const startupName = startupsMap[c.startup_id]?.toLowerCase() || ""
      return (
        c.author_name.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        startupName.includes(q)
      )
    })
  }, [comments, startupsMap, query])

  const deleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this comment?")) return

    setDeletingId(id)
    try {
      const token = (await getToken({ template: "supabase" }).catch(() => null)) || (await getToken())
      const supabase = createClerkSupabaseClient(token)
      const { error } = await supabase.from("comments").delete().eq("id", id)

      if (!error) {
        setComments((prev) => prev.filter((c) => c.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete comment:", err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader
        title="Comments"
        subtitle="Review community discussions, feedback, and moderation"
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-muted-foreground">
            Total Comments: <span className="text-foreground font-bold">{comments.length}</span>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by author, text, or product..."
            className="h-9 max-w-xs rounded-full bg-background"
          />
        </div>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl border border-border/80 bg-card p-4 animate-pulse" />
            ))
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              {comments.length === 0
                ? "No comments in the database yet."
                : "No comments match your search filter."}
            </div>
          ) : (
            visible.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 hover:border-border transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-8 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center font-bold text-xs">
                      {c.author_avatar ? (
                        <Image
                          src={c.author_avatar}
                          alt={c.author_name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <span>{c.author_name?.[0]?.toUpperCase() ?? "A"}</span>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">{c.author_name}</span>
                      <span className="text-muted-foreground"> on </span>
                      <span className="font-medium text-foreground">
                        {startupsMap[c.startup_id] || "Product"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {" "}
                        · {c.created_at ? new Date(c.created_at).toLocaleString() : "Just now"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Icon icon="solar:arrow-up-linear" className="size-3 text-[#FF6154]" />
                      {c.votes_count}
                    </span>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      disabled={deletingId === c.id}
                      onClick={() => deleteComment(c.id)}
                      title="Delete comment"
                    >
                      <Icon icon="solar:trash-bin-trash-linear" className="size-3.5" />
                      <span className="ml-1 text-xs">Delete</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 pl-10.5">{c.content}</p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
