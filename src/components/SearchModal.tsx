"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/AppIcon";
import { UpvoteIcon } from "@/components/Icons";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchableProducts = [
  {
    id: "1",
    name: "Tidaro (Takata)",
    tagline: "The all-in-one desk booking & office management tool for hybrid teams",
    category: "Productivity",
    votes: 454,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCc_ilBidrsf3xEc0mzfIHSbzECMhOyipuPld9CxrwAwr8ZgpRLAbU2AJDVS7YJAgw6eSUNMelInTmDaSNnK7_m3OIiS03TEc1OTumF7BEOwVIQGJA3L8hlsYekh3WFv8aBSea0NY3WmAi5v_3CKOy-NU9iHll7bQQlFkIvaPdrEqWYAx_cMITNba5iTzix1IE0n_Fb_ZBAo1v6P_CO9ZF1Io0u9ezX08NaLI5XstC5kjQdkbXgbjPxg",
  },
  {
    id: "2",
    name: "PayStream Africa",
    tagline: "Seamless cross-border payments for modern African businesses",
    category: "Fintech",
    votes: 432,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1PLNEZWQ8-qSHyZ3Mk61jod-CZlGQk6-UM1kDhhSiKGOn6Jkn4Q1WldxbtmIN-kiORhMUF1Tl0deg4pZ012woozhZ5yMQit-l3gUfJ93ZUbfeaKH6x1MJvFAtmeJsB8uuZJiu75I0Nwi6WF4N61v6OKsHqEdvJdfyDuryY4iwQpggTi-u0ptuNUzoPJEADDXym6pxhpUI-GjoviIBwGPKE1rPlIvGrj5c22-Do75WlcRqxGpn8XBM6A",
  },
  {
    id: "3",
    name: "FarmSense AI",
    tagline: "AI-driven crop yield predictions based on local soil data",
    category: "Agritech",
    votes: 289,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYLxPRPK1JHxdvSZ0LAwHA05SPWjesTi3js_C_x_i0cJ6w61Utr35xuPb0brDEF5zURCTvvfMR7O0DYMTlO_hmyO67iUp7IP6ti4ZQXw9STWrMXcKz-MCLy3ka4pkFe3h4MFDFsKWTYyC99YAgNS4_UzyrAUHvsTs516I4yQiF3tphATghvmyMG9RyS3oT9sTVYaeFW3ia-9_NVs3CbtbO6Vk7ji7Q3nkjPhCE0VNltOvSjYeq9bJlTg",
  },
  {
    id: "4",
    name: "Interactive Sessions",
    tagline: "Drive the full SDLC with AI agents, step by step",
    category: "Developer Tools",
    votes: 238,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMONhfLZ1yo3Bmq6uUIzqneAOPWirGjx0Pk8DnFwJysEVDCsTs75vG4DSG7OV5TqtjzPZRI-O36Nghf1R0nJkknNPSGf_uVAKmJJpc0PZLIO-qPJdrKY5RlzNEQRrMw6onZMl0J4xB3VZuWfLym9ISTcogo0wr_j3eNxsea0rghn-D3uuwxixD1JELn9YjnJ0DVum6RcdySoWbbyBaB_WHsU0gCSBHqnGVMVZHR8YmGa7Dib5clYVrA",
  },
  {
    id: "5",
    name: "DeliverEase",
    tagline: "Last-mile logistics orchestration for informal address systems",
    category: "Logistics",
    votes: 215,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfP6Xgr5gjeZ6hTXUihw9ET8OvlKWYClM-UirkaPbtjCUwFLM_jPWox6bd-A8QXtHBbbI0TMpUsOairuw6VDqPm-dvG4W70KXh5F9qB1dgsOdE3O-yUkLgc90rDYlWMYJ7onvsxvYIvtDF421w4SfPeeJGQn0bz5kdA5nKwg_khIGpAVTwdAbd3ZZuOR_VX2yz-uol-Hc0MbyVhfDbfr4utB8Y6TiDezH1FXA0IDViM-KzbeuUdfhtQ",
  },
];

const quickCategories = ["All", "Fintech", "AI & ML", "Developer Tools", "Agritech", "Productivity"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = searchableProducts.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesQuery =
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.tagline.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
          <Icon icon="solar:magnifer-linear" className="text-xl text-[var(--ink-500)] shrink-0" />
          <input
            type="text"
            placeholder="Search Ethiopian startups, products, categories, or founders..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-base text-[var(--ink-900)] placeholder-[var(--ink-300)] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-[var(--ink-500)] hover:text-[var(--ink-900)] px-2 py-1 bg-[var(--surface-100)] rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono font-medium text-[var(--ink-500)] bg-[var(--surface-50)] border border-[var(--border)] px-2 py-1 rounded-md hover:bg-[var(--surface-100)] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Categories */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-50)] overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-[var(--ink-500)] uppercase tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          {quickCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-[var(--ink-900)] text-[var(--bg)]"
                  : "bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-700)] hover:text-[var(--ink-900)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-[var(--border)]">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--surface-50)] transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-50)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-display text-[var(--ink-900)] group-hover:underline transition-colors truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-100)] text-[var(--ink-700)]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--ink-500)] truncate mt-0.5">{item.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-xs font-bold text-[var(--ink-700)] shrink-0 group-hover:border-[var(--ink-900)]">
                  <UpvoteIcon className="text-sm" />
                  {item.votes}
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center text-[var(--ink-500)]">
              <Icon icon="solar:magnifer-linear" className="text-3xl mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try searching for &quot;Tidaro&quot;, &quot;PayStream&quot;, or &quot;Fintech&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-50)] flex items-center justify-between text-xs text-[var(--ink-500)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] font-mono text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] font-mono text-[10px]">ESC</kbd> Close
            </span>
          </div>
          <Link
            href="/categories"
            onClick={onClose}
            className="text-[var(--ink-900)] font-semibold hover:underline flex items-center gap-1"
          >
            Browse all categories <Icon icon="solar:alt-arrow-right-linear" />
          </Link>
        </div>
      </div>
    </div>
  );
}
