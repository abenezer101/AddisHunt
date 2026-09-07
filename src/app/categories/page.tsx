"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const categories = ["All", "Productivity", "Fintech", "Agritech", "AI & ML", "E-commerce", "Logistics", "Developer Tools"];

const categoryProducts = [
  {
    rank: 1,
    name: "Tidaro",
    tagline: "The all-in-one desk booking & office management tool for hybrid teams",
    category: "Productivity",
    votes: 454,
    comments: 48,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCc_ilBidrsf3xEc0mzfIHSbzECMhOyipuPld9CxrwAwr8ZgpRLAbU2AJDVS7YJAgw6eSUNMelInTmDaSNnK7_m3OIiS03TEc1OTumF7BEOwVIQGJA3L8hlsYekh3WFv8aBSea0NY3WmAi5v_3CKOy-NU9iHll7bQQlFkIvaPdrEqWYAx_cMITNba5iTzix1IE0n_Fb_ZBAo1v6P_CO9ZF1Io0u9ezX08NaLI5XstC5kjQdkbXgbjPxg",
  },
  {
    rank: 2,
    name: "PayStream Africa",
    tagline: "Seamless cross-border payments for modern African businesses.",
    category: "Fintech",
    votes: 432,
    comments: 42,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1PLNEZWQ8-qSHyZ3Mk61jod-CZlGQk6-UM1kDhhSiKGOn6Jkn4Q1WldxbtmIN-kiORhMUF1Tl0deg4pZ012woozhZ5yMQit-l3gUfJ93ZUbfeaKH6x1MJvFAtmeJsB8uuZJiu75I0Nwi6WF4N61v6OKsHqEdvJdfyDuryY4iwQpggTi-u0ptuNUzoPJEADDXym6pxhpUI-GjoviIBwGPKE1rPlIvGrj5c22-Do75WlcRqxGpn8XBM6A",
  },
  {
    rank: 3,
    name: "FarmSense AI",
    tagline: "AI-driven crop yield predictions based on local soil data.",
    category: "Agritech",
    votes: 289,
    comments: 28,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYLxPRPK1JHxdvSZ0LAwHA05SPWjesTi3js_C_x_i0cJ6w61Utr35xuPb0brDEF5zURCTvvfMR7O0DYMTlO_hmyO67iUp7IP6ti4ZQXw9STWrMXcKz-MCLy3ka4pkFe3h4MFDFsKWTYyC99YAgNS4_UzyrAUHvsTs516I4yQiF3tphATghvmyMG9RyS3oT9sTVYaeFW3ia-9_NVs3CbtbO6Vk7ji7Q3nkjPhCE0VNltOvSjYeq9bJlTg",
  },
  {
    rank: 4,
    name: "DeliverEase",
    tagline: "Last-mile logistics orchestration for informal address systems.",
    category: "Logistics",
    votes: 215,
    comments: 15,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMONhfLZ1yo3Bmq6uUIzqneAOPWirGjx0Pk8DnFwJysEVDCsTs75vG4DSG7OV5TqtjzPZRI-O36Nghf1R0nJkknNPSGf_uVAKmJJpc0PZLIO-qPJdrKY5RlzNEQRrMw6onZMl0J4xB3VZuWfLym9ISTcogo0wr_j3eNxsea0rghn-D3uuwxixD1JELn9YjnJ0DVum6RcdySoWbbyBaB_WHsU0gCSBHqnGVMVZHR8YmGa7Dib5clYVrA",
  },
  {
    rank: 5,
    name: "Interactive Sessions",
    tagline: "Drive the full SDLC with AI agents, step by step.",
    category: "Developer Tools",
    votes: 238,
    comments: 83,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfP6Xgr5gjeZ6hTXUihw9ET8OvlKWYClM-UirkaPbtjCUwFLM_jPWox6bd-A8QXtHBbbI0TMpUsOairuw6VDqPm-dvG4W70KXh5F9qB1dgsOdE3O-yUkLgc90rDYlWMYJ7onvsxvYIvtDF421w4SfPeeJGQn0bz5kdA5nKwg_khIGpAVTwdAbd3ZZuOR_VX2yz-uol-Hc0MbyVhfDbfr4utB8Y6TiDezH1FXA0IDViM-KzbeuUdfhtQ",
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? categoryProducts
    : categoryProducts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

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
            Discover top-ranked startups and tools
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
          {filteredProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center bg-[var(--ink-900)] text-[var(--bg)] rounded-lg text-xs font-bold cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors cursor-pointer"
          >
            3
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}