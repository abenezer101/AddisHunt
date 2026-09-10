"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { RoleBadge } from "@/components/status-badge"
import { users as seed, type UserRole } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const roles: Array<"all" | UserRole> = ["all", "maker", "hunter", "moderator", "admin"]

export default function UsersPage() {
  const [role, setRole] = useState<(typeof roles)[number]>("all")
  const [query, setQuery] = useState("")

  const visible = useMemo(() => {
    return seed.filter((u) => {
      const q = query.trim().toLowerCase()
      const matches =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      return matches && (role === "all" || u.role === role)
    })
  }, [role, query])

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Users" subtitle="Makers, hunters, and the people who keep the board honest" />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  role === r ? "bg-[#1A1815] text-[#FAF9F7]" : "border border-border bg-background hover:bg-muted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or @handle"
            className="h-9 max-w-xs rounded-full"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Upvotes given</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-[#1A1815] text-[11px] font-semibold text-[#FAF9F7]">
                        {u.initials}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">
                          @{u.username} · {u.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={u.role} />
                  </TableCell>
                  <TableCell className="text-sm">{u.location}</TableCell>
                  <TableCell className="text-sm">{u.products}</TableCell>
                  <TableCell className="text-sm font-medium">{u.upvotes.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
