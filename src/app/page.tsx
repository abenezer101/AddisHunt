"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { Icon } from "@/components/AppIcon";
import Link from "next/link";
import { UpvoteIcon, CommentIcon } from "@/components/Icons";
import { createAnonSupabaseClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/supabaseClient";

type Startup = Database["public"]["Tables"]["startups"]["Row"];

const forumThreads = [
  {
    channel: "p/general",
    title: "Product Hunt's State of Tech Discovery: Q2 2026",
    upvotes: 643,
    comments: 587,
    online: 12,
  },
  {
    channel: "p/general",
    title: "When is the right time to launch on Product Hunt?",
    upvotes: 432,
    comments: 114,
    online: 7,
  },
  {
    channel: "p/makers",
    title: "📢 What social media do you use as a maker?",
    upvotes: 189,
    comments: 102,
  },
  {
    channel: "p/engineering",
    title: "🧠 Do solo makers need a UI/UX designer?",
    upvotes: 351,
    comments: 169,
  },
  {
    channel: "p/general",
    title: "What's the best tech stack for a fast MVP in 2026?",
    upvotes: 395,
    comments: 145,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"featured" | "all">("featured");
  const [products, setProducts] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createAnonSupabaseClient();
    supabase
      .from("startups")
      .select("*")
      .eq("status", "approved")
      .order("votes_count", { ascending: false })
      .limit(activeTab === "featured" ? 4 : 20)
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, [activeTab]);

  const mappedProducts = products.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    tagline: p.tagline,
    category: p.categories?.[0] ?? "General",
    tags: p.categories ?? [],
    votes: p.votes_count,
    comments: 0,
    image: p.logo_url ?? "",
    imageAlt: `${p.name} logo`,
    id: p.id,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />

      <main className="flex-grow w-full page-container py-6 sm:py-8 2xl:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-10 3xl:gap-12 items-stretch">
          {/* Main Content Column (8 cols): header + products + banner */}
          <div className="lg:col-span-8 flex flex-col gap-6 2xl:gap-8">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
              <div>
                <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                  Top Products Launching Today
                </h1>
              </div>

              <div className="flex items-center gap-1 bg-[var(--surface-50)] p-1 rounded-full border border-[var(--border)] text-xs 2xl:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("featured")}
                  className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                    activeTab === "featured"
                      ? "bg-[var(--bg)] text-[var(--ink-900)] shadow-2xs"
                      : "text-[var(--ink-500)] hover:text-[var(--ink-900)]"
                  }`}
                >
                  Featured
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[var(--bg)] text-[var(--ink-900)] shadow-2xs"
                      : "text-[var(--ink-500)] hover:text-[var(--ink-900)]"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3.5 2xl:space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-[var(--surface-50)] border border-[var(--border)] animate-pulse"
                  />
                ))
              ) : mappedProducts.length === 0 ? (
                <div className="text-center py-12 text-[var(--ink-400)] text-sm">
                  No products yet. <Link href="/submit" className="underline text-[var(--ink-700)]">Be the first to submit!</Link>
                </div>
              ) : (
                mappedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Featured Banner Card */}
            <a
              href="https://link.prepl.me/74FF"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm relative group cursor-pointer max-h-[280px] xl:max-h-[340px] 2xl:max-h-[420px] 3xl:max-h-[480px]"
            >
              <Image
                src="/images/prepl-launch-banner.webp"
                alt="Promotional Banner"
                width={1600}
                height={605}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 1000px, 1400px"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover object-center group-hover:opacity-95 transition-opacity"
              />
            </a>
          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base sm:text-lg 2xl:text-xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                  Trending Forum Threads
                </h2>
              </div>

              <div className="space-y-3.5 2xl:space-y-4 flex-1">
                {forumThreads.map((thread, i) => (
                  <div key={i} className="space-y-1 pb-3 2xl:pb-4 border-b border-[var(--border)] last:border-b-0">
                    <span className="text-xs 2xl:text-sm font-medium text-[var(--ink-500)] block">
                      {thread.channel}
                    </span>
                    <h3 className="text-sm 2xl:text-base font-bold font-display text-[var(--ink-900)] hover:underline cursor-pointer leading-snug">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs 2xl:text-sm text-[var(--ink-500)] pt-1">
                      <span className="flex items-center gap-1 font-medium hover:text-[var(--ink-900)] cursor-pointer">
                        <UpvoteIcon className="text-xs 2xl:text-sm" />
                        Upvote ({thread.upvotes})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CommentIcon className="text-xs 2xl:text-sm" />
                        {thread.comments}
                      </span>
                      {thread.online && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            {thread.online} online
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Action Buttons */}
              <div className="space-y-2.5 pt-4 2xl:pt-6 mt-auto">
                <Link
                  href="/launches"
                  className="w-full py-2.5 2xl:py-3 border border-[var(--border)] rounded-full text-sm 2xl:text-base font-semibold text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors text-center block cursor-pointer"
                >
                  View all
                </Link>
                <Link
                  href="/submit"
                  className="w-full py-2.5 2xl:py-3 border border-[var(--border)] rounded-full text-sm 2xl:text-base font-semibold text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Icon icon="solar:add-circle-linear" className="text-base 2xl:text-lg" />
                  Submit a Product
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}