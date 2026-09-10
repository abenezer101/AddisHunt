import { Badge } from "@/components/ui/badge"
import type { AdStatus, CommentStatus, ProductStatus, UserRole } from "@/lib/data"

const productStyles: Record<ProductStatus, string> = {
  live: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  pending: "bg-amber-500/12 text-amber-800 border-amber-500/25",
  scheduled: "bg-sky-500/10 text-sky-800 border-sky-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  hidden: "bg-muted text-muted-foreground border-border",
}

const commentStyles: Record<CommentStatus, string> = {
  visible: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  flagged: "bg-amber-500/12 text-amber-800 border-amber-500/25",
  hidden: "bg-muted text-muted-foreground border-border",
}

const roleStyles: Record<UserRole, string> = {
  admin: "bg-[#1A1815] text-[#FAF9F7] border-transparent",
  moderator: "bg-[#FF6154]/12 text-[#c2410c] border-[#FF6154]/20",
  maker: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  hunter: "bg-[#efe8dc] text-[#1A1815] border-[#dedad2]",
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${productStyles[status]}`}>
      {status}
    </Badge>
  )
}

export function CommentStatusBadge({ status }: { status: CommentStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${commentStyles[status]}`}>
      {status}
    </Badge>
  )
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant="outline" className={`capitalize ${roleStyles[role]}`}>
      {role}
    </Badge>
  )
}

const adStyles: Record<AdStatus, string> = {
  live: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  scheduled: "bg-sky-500/10 text-sky-800 border-sky-500/20",
  paused: "bg-amber-500/12 text-amber-800 border-amber-500/25",
  ended: "bg-muted text-muted-foreground border-border",
  pending: "bg-[#FF6154]/12 text-[#c2410c] border-[#FF6154]/20",
}

export function AdStatusBadge({ status }: { status: AdStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${adStyles[status]}`}>
      {status}
    </Badge>
  )
}

export function ProductMark({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm"
      style={{ background: accent }}
    >
      {initials}
    </div>
  )
}
