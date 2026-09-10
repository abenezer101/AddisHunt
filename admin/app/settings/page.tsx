"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    siteName: "Addis Hunt",
    tagline: "Discover African Innovation",
    launchTime: "00:01",
    timezone: "Africa/Addis_Ababa",
    featuredSlots: "3",
    promotedSlots: "1",
    reviewEmail: "ops@addishunt.com",
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PageHeader title="Settings" subtitle="How the hunt runs — window, slots, and ops email" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <form
          className="mx-auto max-w-2xl space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(true)
          }}
        >
          <Card className="shadow-none border-border/80">
            <CardHeader>
              <CardTitle className="text-base">Site</CardTitle>
              <CardDescription>Public name and homepage line</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Site name" name="siteName" value={form.siteName} onChange={onChange} />
              <Field label="Tagline" name="tagline" value={form.tagline} onChange={onChange} />
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/80">
            <CardHeader>
              <CardTitle className="text-base">Launch window</CardTitle>
              <CardDescription>Products go live together. Default is 12:01 AM EAT.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Daily launch time" name="launchTime" type="time" value={form.launchTime} onChange={onChange} />
              <Field label="Timezone" name="timezone" value={form.timezone} onChange={onChange} />
              <Field label="Featured slots" name="featuredSlots" value={form.featuredSlots} onChange={onChange} />
              <Field label="Promoted slots" name="promotedSlots" value={form.promotedSlots} onChange={onChange} />
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/80">
            <CardHeader>
              <CardTitle className="text-base">Ops</CardTitle>
              <CardDescription>Where pending-review alerts land</CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="Review email" name="reviewEmail" type="email" value={form.reviewEmail} onChange={onChange} />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" className="rounded-full">
              Save settings
            </Button>
            {saved ? <span className="text-sm text-emerald-700">Saved locally — wire this to Supabase next.</span> : null}
          </div>
        </form>
      </main>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <Input name={name} type={type} value={value} onChange={onChange} className="rounded-xl bg-background" />
    </label>
  )
}
