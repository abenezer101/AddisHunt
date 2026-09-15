"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignInButton, useClerk, useUser } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Icon } from "@iconify/react"

type NavItem = {
  title: string
  url: string
  icon: string
  badge?: string
  accent?: boolean
}

const hunt: NavItem[] = [
  { title: "Dashboard", url: "/", icon: "solar:widget-2-linear" },
  { title: "Products", url: "/products", icon: "solar:box-linear" },
  { title: "Launch queue", url: "/products?filter=pending", icon: "solar:rocket-linear" },
]

const community: NavItem[] = [
  { title: "Comments", url: "/comments", icon: "solar:chat-round-dots-linear" },
  { title: "Categories", url: "/categories", icon: "solar:tag-linear" },
  { title: "Users", url: "/users", icon: "solar:users-group-rounded-linear" },
]

const ops: NavItem[] = [
  { title: "Settings", url: "/settings", icon: "solar:settings-linear" },
]

function NavItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const href = item.url.split("?")[0]
        const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href)
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.title}
              render={<Link href={item.url} />}
              className={`rounded-lg cursor-pointer ${item.accent ? "text-[#c2410c] hover:text-[#c2410c]" : ""}`}
            >
              <Icon icon={item.icon} className="size-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
            {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export function AppSidebar() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link href="/" className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center cursor-pointer">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1A1815] text-[#FAF9F7] font-semibold tracking-tight">
            A
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[15px] font-semibold tracking-tight leading-none">Addis Hunt</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Admin console</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>The hunt</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavItems items={hunt} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavItems items={community} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Ops</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavItems items={ops} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-3">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1815] px-2.5 py-2 text-xs font-semibold text-[#FAF9F7] hover:opacity-90 cursor-pointer group-data-[collapsible=icon]:px-0"
            >
              <Icon icon="solar:login-2-linear" className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sign in</span>
            </button>
          </SignInButton>
        ) : (
        <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-background/70 px-2.5 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A1815] text-[11px] font-semibold text-[#FAF9F7]">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName ?? "User"}
                width={32}
                height={32}
                className="size-full object-cover"
              />
            ) : (
              <span>{user?.firstName?.[0] ?? "A"}</span>
            )}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-medium leading-tight">
              {user?.fullName || user?.firstName || "Admin"}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || "admin@addishunt.pro"}
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="mt-1 text-[11px] font-semibold text-red-500 hover:text-red-600 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
