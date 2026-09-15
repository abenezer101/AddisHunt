"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isLoaded, isSignedIn, userId, getToken } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  // The sign-in page must always render without a gate.
  const isSignInRoute = pathname?.startsWith("/sign-in")
  useEffect(() => {
    if (isSignInRoute) return
    if (!isLoaded || !isSignedIn || !userId) {
      setIsAdmin(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const token =
          (await getToken({ template: "supabase" }).catch(() => null)) || (await getToken())
        const supabase = createClerkSupabaseClient(token)
        const { data } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle()
        if (!cancelled) setIsAdmin(!!data)
      } catch {
        if (!cancelled) setIsAdmin(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isSignInRoute, isLoaded, isSignedIn, userId, getToken])

  if (isSignInRoute) return <>{children}</>

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#1A1815] text-[#FAF9F7] font-semibold">
            A
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">Admin sign-in required</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your admin account to access the console.
            </p>
          </div>
          <Link href="/sign-in">
            <Button className="w-full rounded-full cursor-pointer">Sign in</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isAdmin === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        Verifying admin access…
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center space-y-4">
          <h1 className="text-lg font-semibold tracking-tight">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            This account is not on the admin list. Ask an admin to add your user ID.
          </p>
          <p className="font-mono text-[11px] text-muted-foreground break-all">{userId}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
