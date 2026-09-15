"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/AppIcon";
import { UpvoteIcon } from "@/components/Icons";
import { createAnonSupabaseClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/supabaseClient";

type Startup = Database["public"]["Tables"]["startups"]["Row"];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickCategories = ["All", "Fintech", "AI & ML", "Developer Tools", "Agritech", "Productivity", "Logistics", "E-commerce"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      // Fetch products from Supabase
      setLoading(true);
      const supabase = createAnonSupabaseClient();
      supabase
        .from("startups")
        .select("*")
        .eq("status", "approved")
        .order("votes_count", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setProducts(data);
          setLoading(false);
        });
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = products.filter((product) => {
    const primaryCat = product.categories?.[0] || "";
    const allCats = product.categories || [];
    const matchesCategory =
      activeCategory === "All" ||
      allCats.some((c) => c.toLowerCase().includes(activeCategory.toLowerCase()));

    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.tagline.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      allCats.some((c) => c.toLowerCase().includes(q));

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
            className="text-xs font-mono font-medium text-[var(--ink-500)] bg-[var(--surface-50)] border border-[var(--border)] px-2 py-1 rounded-md hover:bg-[var(--surface-100)] transition-colors cursor-pointer"
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
              className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
          {loading ? (
            <div className="py-12 text-center text-sm text-[var(--ink-400)] animate-pulse">
              Searching products...
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--surface-50)] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-100)] flex items-center justify-center">
                    {item.logo_url ? (
                      <Image
                        src={item.logo_url}
                        alt={item.name}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-bold font-display text-[var(--ink-700)]">
                        {item.name ? item.name.charAt(0).toUpperCase() : "A"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-display text-[var(--ink-900)] group-hover:underline transition-colors truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-100)] text-[var(--ink-700)]">
                        {item.categories?.[0] || "General"}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--ink-500)] truncate mt-0.5">{item.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-xs font-bold text-[var(--ink-700)] shrink-0 group-hover:border-[var(--ink-900)]">
                  <UpvoteIcon className="text-sm" />
                  {item.votes_count}
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center text-[var(--ink-500)]">
              <Icon icon="solar:magnifer-linear" className="text-3xl mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try searching by name, tag, or switching filters</p>
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
            className="text-[var(--ink-900)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Browse all categories <Icon icon="solar:alt-arrow-right-linear" />
          </Link>
        </div>
      </div>
    </div>
  );
}
