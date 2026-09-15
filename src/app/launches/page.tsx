"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { createAnonSupabaseClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/supabaseClient";

type Startup = Database["public"]["Tables"]["startups"]["Row"];

function formatDay(dateStr: string): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const d = new Date(dateStr);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createAnonSupabaseClient();
    supabase
      .from("startups")
      .select("*")
      .eq("status", "approved")
      .order("launch_date", { ascending: false })
      .order("votes_count", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setLaunches(data);
        setLoading(false);
      });
  }, []);

  // Group by day label
  const grouped: Record<string, Startup[]> = {};
  for (const p of launches) {
    const label = p.launch_date ? formatDay(p.launch_date) : "Older";
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(p);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />
      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)] mb-1 tracking-tight">
            Recent Launches
          </h1>
          <p className="text-sm font-medium text-[var(--ink-500)]">
            Explore daily and weekly tech releases
          </p>
        </div>

        {/* Date Sections */}
        <div className="space-y-8">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-[var(--surface-50)] border border-[var(--border)] animate-pulse" />
            ))
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-center text-[var(--ink-400)] py-12 text-sm">No launches yet.</p>
          ) : (
            Object.entries(grouped).map(([day, products]) => (
              <div key={day} className="space-y-3.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-700)] font-display border-b border-[var(--border)] pb-2">
                  {day}
                </h2>
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      rank: i + 1,
                      name: product.name,
                      tagline: product.tagline,
                      category: product.categories?.[0] ?? "General",
                      tags: product.categories ?? [],
                      votes: product.votes_count,
                      comments: 0,
                      image: product.logo_url ?? "",
                      imageAlt: `${product.name} logo`,
                      id: product.id,
                    }}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}