"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { UpvoteIcon, CommentIcon } from "@/components/Icons";
import { useUser, useSession, useClerk } from "@clerk/nextjs";
import { createClerkSupabaseClient, createAnonSupabaseClient } from "@/lib/supabaseClient";

export interface Product {
  id?: string | number;
  rank: number;
  name: string;
  tagline: string;
  category: string;
  tags?: string[];
  votes: number;
  comments: number;
  image: string;
  imageAlt?: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

export default memo(function ProductCard({ product }: ProductCardProps) {
  const { user } = useUser();
  const { session } = useSession();
  const { openSignIn } = useClerk();
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(product.votes);

  useEffect(() => {
    setVoteCount(product.votes);
  }, [product.votes]);

  useEffect(() => {
    if (!user || !product.id || typeof product.id !== "string") return;
    const supabase = createAnonSupabaseClient();
    supabase
      .from("votes")
      .select("startup_id")
      .eq("startup_id", product.id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setVoted(true);
      });
  }, [user, product.id]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openSignIn();
      return;
    }

    const nextVoted = !voted;
    setVoted(nextVoted);
    setVoteCount(nextVoted ? voteCount + 1 : voteCount - 1);

    if (session && product.id && typeof product.id === "string") {
      try {
        const token = await session.getToken();
        const supabase = createClerkSupabaseClient(async () => token);
        if (nextVoted) {
          await supabase.from("votes").insert({ startup_id: product.id, user_id: user.id });
        } else {
          await supabase.from("votes").delete().eq("startup_id", product.id).eq("user_id", user.id);
        }
      } catch (err) {
        console.error("Error updating vote:", err);
      }
    }
  };

  const productTags = product.tags || [product.category, "Software", "Ethiopian Tech"];

  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/product/${product.id || "1"}`}
      className="feed-item flex items-start sm:items-center justify-between p-3.5 sm:p-4 2xl:p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-50)] hover:border-[var(--ink-300)] transition-colors group gap-3.5 sm:gap-4 2xl:gap-5 shadow-2xs hover:shadow-xs"
    >
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 2xl:gap-5 flex-1 min-w-0">
        {/* Startup logo */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16 rounded-2xl overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-100)] flex items-center justify-center shadow-2xs">
          {product.image && !imgError ? (
            <Image
              src={product.image}
              alt={product.imageAlt || product.name}
              width={64}
              height={64}
              sizes="(max-width: 1440px) 56px, 64px"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <span className="text-xl sm:text-2xl font-bold font-display text-[var(--ink-700)]">
              {product.name ? product.name.charAt(0).toUpperCase() : "A"}
            </span>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base 2xl:text-lg font-bold font-display text-[var(--ink-900)] group-hover:underline transition-colors truncate">
              {product.rank}. {product.name}
            </h3>
            {product.badge && (
              <span className="text-[10px] 2xl:text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 shrink-0">
                {product.badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm 2xl:text-base font-body text-[var(--ink-500)] line-clamp-1 mt-0.5">
            {product.tagline}
          </p>

          {/* Tags row matching Product Hunt style */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs 2xl:text-sm text-[var(--ink-500)]">
            <span className="text-[10px] 2xl:text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-100)] text-[var(--ink-700)]">
              {product.category}
            </span>
            <span className="text-[var(--ink-300)] hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] 2xl:text-xs">
              {productTags.slice(0, 3).map((tag, idx) => (
                <span key={tag} className="flex items-center gap-1.5 text-[var(--ink-500)]">
                  <span className="hover:text-[var(--ink-900)] transition-colors">{tag}</span>
                  {idx < Math.min(productTags.length, 3) - 1 && (
                    <span className="text-[var(--ink-300)]">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action boxes matching Product Hunt (Comment box + Upvote box) */}
      <div className="flex items-center gap-2 shrink-0 self-center">
        {/* Comment count box */}
        <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 sm:w-13 sm:h-13 2xl:w-15 2xl:h-15 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--surface-100)] hover:border-[var(--ink-900)] transition-all cursor-pointer">
          <CommentIcon className="text-base 2xl:text-lg mb-0.5" />
          <span className="text-xs 2xl:text-sm font-bold font-display leading-none">{product.comments}</span>
        </div>

        {/* Upvote box */}
        <button
          onClick={handleVote}
          className={`flex flex-col items-center justify-center w-12 h-12 sm:w-13 sm:h-13 2xl:w-15 2xl:h-15 rounded-xl border transition-all cursor-pointer ${
            voted
              ? "bg-[var(--ink-900)] text-[var(--bg)] border-[var(--ink-900)] shadow-xs"
              : "bg-[var(--bg)] text-[var(--ink-900)] border-[var(--border)] hover:bg-[var(--surface-100)] hover:border-[var(--ink-900)]"
          }`}
          aria-pressed={voted}
          aria-label={voted ? "Remove upvote" : "Upvote"}
        >
          <UpvoteIcon
            filled={voted}
            className="text-base 2xl:text-lg mb-0.5"
          />
          <span className="text-xs 2xl:text-sm font-bold font-display leading-none">{voteCount}</span>
        </button>
      </div>
    </Link>
  );
})