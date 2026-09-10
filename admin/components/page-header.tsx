import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@iconify/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function PageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/90 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden w-56 md:block">
            <Icon icon="solar:magnifer-linear" className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, makers…"
              className="h-8 rounded-full bg-muted/60 pl-8 text-xs shadow-none"
            />
          </div>
          <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Notifications">
            <Icon icon="solar:bell-linear" className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
