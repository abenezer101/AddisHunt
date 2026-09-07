"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { Icon } from "@/components/AppIcon";
import Link from "next/link";
import { UpvoteIcon, CommentIcon } from "@/components/Icons";

const todayProducts = [
  {
    rank: 1,
    name: "Tidaro",
    tagline: "The all-in-one desk booking & office management tool for hybrid teams",
    category: "Productivity",
    tags: ["Hybrid Work", "Desk Booking", "SaaS"],
    votes: 454,
    comments: 48,
    badge: "Promoted",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCc_ilBidrsf3xEc0mzfIHSbzECMhOyipuPld9CxrwAwr8ZgpRLAbU2AJDVS7YJAgw6eSUNMelInTmDaSNnK7_m3OIiS03TEc1OTumF7BEOwVIQGJA3L8hlsYekh3WFv8aBSea0NY3WmAi5v_3CKOy-NU9iHll7bQQlFkIvaPdrEqWYAx_cMITNba5iTzix1IE0n_Fb_ZBAo1v6P_CO9ZF1Io0u9ezX08NaLI5XstC5kjQdkbXgbjPxg",
    imageAlt: "Tidaro logo",
  },
  {
    rank: 2,
    name: "PayStream Africa",
    tagline: "Seamless cross-border payments for modern African businesses",
    category: "Fintech",
    tags: ["Payments", "API", "B2B"],
    votes: 432,
    comments: 31,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1PLNEZWQ8-qSHyZ3Mk61jod-CZlGQk6-UM1kDhhSiKGOn6Jkn4Q1WldxbtmIN-kiORhMUF1Tl0deg4pZ012woozhZ5yMQit-l3gUfJ93ZUbfeaKH6x1MJvFAtmeJsB8uuZJiu75I0Nwi6WF4N61v6OKsHqEdvJdfyDuryY4iwQpggTi-u0ptuNUzoPJEADDXym6pxhpUI-GjoviIBwGPKE1rPlIvGrj5c22-Do75WlcRqxGpn8XBM6A",
    imageAlt: "PayStream logo",
  },
  {
    rank: 3,
    name: "FarmSense AI",
    tagline: "AI-driven crop yield predictions based on local soil data",
    category: "Agritech",
    tags: ["Artificial Intelligence", "Agritech", "Sensors"],
    votes: 289,
    comments: 26,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYLxPRPK1JHxdvSZ0LAwHA05SPWjesTi3js_C_x_i0cJ6w61Utr35xuPb0brDEF5zURCTvvfMR7O0DYMTlO_hmyO67iUp7IP6ti4ZQXw9STWrMXcKz-MCLy3ka4pkFe3h4MFDFsKWTYyC99YAgNS4_UzyrAUHvsTs516I4yQiF3tphATghvmyMG9RyS3oT9sTVYaeFW3ia-9_NVs3CbtbO6Vk7ji7Q3nkjPhCE0VNltOvSjYeq9bJlTg",
    imageAlt: "FarmSense logo",
  },
  {
    rank: 4,
    name: "Interactive Sessions",
    tagline: "Drive the full SDLC with AI agents, step by step",
    category: "Developer Tools",
    tags: ["Software Engineering", "Developer Tools", "AI"],
    votes: 238,
    comments: 83,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMONhfLZ1yo3Bmq6uUIzqneAOPWirGjx0Pk8DnFwJysEVDCsTs75vG4DSG7OV5TqtjzPZRI-O36Nghf1R0nJkknNPSGf_uVAKmJJpc0PZLIO-qPJdrKY5RlzNEQRrMw6onZMl0J4xB3VZuWfLym9ISTcogo0wr_j3eNxsea0rghn-D3uuwxixD1JELn9YjnJ0DVum6RcdySoWbbyBaB_WHsU0gCSBHqnGVMVZHR8YmGa7Dib5clYVrA",
    imageAlt: "Interactive Sessions logo",
  },
];

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
    title: "What’s the best tech stack for a fast MVP in 2026?",
    upvotes: 395,
    comments: 145,
  },
  {
    channel: "p/general",
    title: "What’s the best tech stack for a fast MVP in 2026?",
    upvotes: 395,
    comments: 145,
  },
  {
    channel: "p/general",
    title: "What’s the best tech stack for a fast MVP in 2026?",
    upvotes: 395,
    comments: 145,
  },
  {
    channel: "p/general",
    title: "What’s the best tech stack for a fast MVP in 2026?",
    upvotes: 395,
    comments: 145,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"featured" | "all">("featured");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />

      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Content Column (8 cols): header + products + banner */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                  Top Products Launching Today
                </h1>
              </div>

              <div className="flex items-center gap-1 bg-[var(--surface-50)] p-1 rounded-full border border-[var(--border)] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("featured")}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
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
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
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
            <div className="space-y-3.5">
              {todayProducts.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>

            {/* Featured Banner Card */}
            <a
              href="https://link.prepl.me/74FF"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm relative group cursor-pointer max-h-[280px]"
            >
              <Image
                src="/images/prepl-launch-banner.webp"
                alt="Promotional Banner"
                width={1600}
                height={605}
                sizes="(max-width: 768px) 100vw, 800px"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover object-center group-hover:opacity-95 transition-opacity"
              />
            </a>
          </div>

          {/* Right Sidebar (4 cols) — stretches to match full left column height */}
          <aside className="lg:col-span-4 flex flex-col">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base sm:text-lg font-bold font-display text-[var(--ink-900)] tracking-tight">
                  Trending Forum Threads
                </h2>
              </div>

              <div className="space-y-3.5">
                {forumThreads.map((thread, i) => (
                  <div key={i} className="space-y-1 pb-3 border-b border-[var(--border)] last:border-b-0">
                    <span className="text-xs font-medium text-[var(--ink-500)] block">
                      {thread.channel}
                    </span>
                    <h3 className="text-sm font-bold font-display text-[var(--ink-900)] hover:underline cursor-pointer leading-snug">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--ink-500)] pt-1">
                      <span className="flex items-center gap-1 font-medium hover:text-[var(--ink-900)] cursor-pointer">
                        <UpvoteIcon className="text-xs" />
                        Upvote ({thread.upvotes})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CommentIcon className="text-xs" />
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
              <div className="space-y-2.5 pt-4">
                <Link
                  href="/launches"
                  className="w-full py-2.5 border border-[var(--border)] rounded-full text-sm font-semibold text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors text-center block cursor-pointer"
                >
                  View all
                </Link>
                <Link
                  href="/submit"
                  className="w-full py-2.5 border border-[var(--border)] rounded-full text-sm font-semibold text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Icon icon="solar:add-circle-linear" className="text-base" />
                  Start new thread
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