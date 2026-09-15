"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { createAnonSupabaseClient, type Database } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icon } from "@iconify/react"

interface CommunityUser {
  id: string
  name: string
  submissionsCount: number
  commentsCount: number
  votesCount: number
  firstSeen: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<CommunityUser[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createAnonSupabaseClient()
        const [{ data: startups }, { data: comments }, { data: votes }] = await Promise.all([
          supabase.from("startups").select("founder_id, created_at"),
          supabase.from("comments").select("user_id, author_name, created_at"),
          supabase.from("votes").select("user_id, created_at"),
        ])

        const userMap: Record<string, CommunityUser> = {}

        if (startups) {
          startups.forEach((s) => {
            const id = s.founder_id
            if (!id) return
            if (!userMap[id]) {
              userMap[id] = {
                id,
                name: `User ${id.slice(-6)}`,
                submissionsCount: 0,
                commentsCount: 0,
                votesCount: 0,
                firstSeen: s.created_at || new Date().toISOString(),
              }
            }
            userMap[id].submissionsCount += 1
          })
        }

        if (comments) {
          comments.forEach((c) => {
            const id = c.user_id
            if (!id) return
            if (!userMap[id]) {
              userMap[id] = {
                id,
                name: c.author_name || `User ${id.slice(-6)}`,
                submissionsCount: 0,
                commentsCount: 0,
                votesCount: 0,
                firstSeen: c.created_at || new Date().toISOString(),
              }
            } else if (c.author_name && !userMap[id].name.startsWith("User ")) {
              userMap[id].name = c.author_name
            }
            userMap[id].commentsCount += 1
          })
        }

        if (votes) {
          votes.forEach((v) => {
            const id = v.user_id
            if (!id) return
            if (!userMap[id]) {
              userMap[id] = {
                id,
                name: `Hunter ${id.slice(-6)}`,
                submissionsCount: 0,
                commentsCount: 0,
                votesCount: 0,
                firstSeen: v.created_at || new Date().toISOString(),
              }
            }
            userMap[id].votesCount += 1
          })
        }

        setUsers(Object.values(userMap))
      } catch (err) {
        console.error("Failed to aggregate community users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const visible = useMemo(() => {
    return users.filter((u) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
    })
  }, [users, query])

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader
        title="Users"
        subtitle="Makers, hunters, and active contributors across Addis Hunt"
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-muted-foreground">
            Active Community Members: <span className="text-foreground font-bold">{users.length}</span>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="h-9 max-w-xs rounded-full bg-background"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User / Contributor</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Upvotes Cast</TableHead>
                <TableHead>First Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="py-4">
                      <div className="h-6 rounded bg-muted animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    {users.length === 0
                      ? "No user activity recorded in Supabase yet."
                      : "No members match your search query."}
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#1A1815] text-[11px] font-semibold text-[#FAF9F7] shrink-0 font-display">
                          {u.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{u.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {u.id.length > 20 ? `${u.id.slice(0, 16)}...` : u.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      {u.submissionsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs">
                          {u.submissionsCount} {u.submissionsCount === 1 ? "product" : "products"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      {u.commentsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full text-xs">
                          {u.commentsCount} {u.commentsCount === 1 ? "comment" : "comments"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      {u.votesCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full text-xs">
                          <Icon icon="solar:arrow-up-linear" className="size-3" />
                          {u.votesCount} {u.votesCount === 1 ? "vote" : "votes"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(u.firstSeen).toLocaleDateString()}
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
