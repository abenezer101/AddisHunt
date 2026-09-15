"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { createAnonSupabaseClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/supabaseClient";

type Startup = Database["public"]["Tables"]["startups"]["Row"];

const categories = ["All", "Fintech", "AI & ML", "Developer Tools", "Agritech", "Productivity", "Logistics", "E-commerce", "Healthtech", "Edtech"];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const supabase = createAnonSupabaseClient();
    supabase
      .from("startups")
      .select("*")
      .eq("status", "approved")
      .order("votes_count", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setProducts(data);
        }
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.categories?.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />
      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)] mb-1 tracking-tight">
            Browse by Category
          </h1>
          <p className="text-sm font-medium text-[var(--ink-500)]">
            Discover top-ranked startups and tools across Ethiopia
          </p>
        </div>

        {/* Category Rail */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--ink-900)] text-[var(--bg)]"
                  : "border border-[var(--border)] bg-[var(--surface-50)] text-[var(--ink-900)] hover:bg-[var(--surface-100)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="space-y-3.5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-[var(--surface-50)] border border-[var(--border)] animate-pulse" />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  rank: i + 1,
                  name: product.name,
                  tagline: product.tagline,
                  category: product.categories?.[0] ?? "General",
                  tags: product.categories ?? [],
                  votes: product.votes_count,
                  comments: 0,
                  image: product.logo_url ?? "",
                  imageAlt: `${product.name} logo`,
                }}
              />
            ))
          ) : (
            <div className="py-16 text-center text-sm text-[var(--ink-500)] border border-[var(--border)] rounded-2xl bg-[var(--surface-50)]">
              No products found in category &ldquo;{selectedCategory}&rdquo;.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}