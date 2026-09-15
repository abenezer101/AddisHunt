"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/AppIcon";
import { UpvoteIcon } from "@/components/Icons";
import { useSession, useUser, useClerk } from "@clerk/nextjs";
import { createAnonSupabaseClient, createClerkSupabaseClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/supabaseClient";

type Startup = Database["public"]["Tables"]["startups"]["Row"];
type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  replies?: Comment[];
  hasVoted?: boolean;
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { session } = useSession();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const [product, setProduct] = useState<Startup | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMainVoted, setHasMainVoted] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [votingComment, setVotingComment] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    const supabase = createAnonSupabaseClient();
    const { data } = await supabase.from("startups").select("*").eq("id", productId).single();
    if (data) setProduct(data);
    setLoadingProduct(false);
  }, [productId]);

  const fetchComments = useCallback(async () => {
    const supabase = createAnonSupabaseClient();
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("startup_id", productId)
      .is("parent_id", null)
      .order("votes_count", { ascending: false });

    if (!data) return;

    // Fetch replies for each top-level comment
    const withReplies: Comment[] = await Promise.all(
      data.map(async (comment) => {
        const { data: replies } = await supabase
          .from("comments")
          .select("*")
          .eq("parent_id", comment.id)
          .order("created_at", { ascending: true });
        return { ...comment, replies: replies ?? [], hasVoted: false };
      })
    );

    // Check which comments current user has voted on
    if (user) {
      const allCommentIds = withReplies.flatMap((c) => [c.id, ...(c.replies?.map((r) => r.id) ?? [])]);
      const { data: userVotes } = await supabase
        .from("comment_votes")
        .select("comment_id")
        .eq("user_id", user.id)
        .in("comment_id", allCommentIds);

      const votedSet = new Set(userVotes?.map((v) => v.comment_id) ?? []);

      const annotated = withReplies.map((c) => ({
        ...c,
        hasVoted: votedSet.has(c.id),
        replies: c.replies?.map((r) => ({ ...r, hasVoted: votedSet.has(r.id) })),
      }));
      setComments(annotated);
    } else {
      setComments(withReplies);
    }
  }, [productId, user]);

  const checkVoteStatus = useCallback(async () => {
    if (!user) return;
    const supabase = createAnonSupabaseClient();
    const { data } = await supabase
      .from("votes")
      .select("startup_id")
      .eq("startup_id", productId)
      .eq("user_id", user.id)
      .maybeSingle();
    setHasMainVoted(!!data);
  }, [productId, user]);

  useEffect(() => {
    fetchProduct();
    fetchComments();
    checkVoteStatus();
  }, [fetchProduct, fetchComments, checkVoteStatus]);

  const handleMainVote = async () => {
    if (!user) {
      openSignIn();
      return;
    }
    if (!session || !product) return;
    const token = await session.getToken();
    const supabase = createClerkSupabaseClient(async () => token);

    if (hasMainVoted) {
      await supabase.from("votes").delete().eq("startup_id", productId).eq("user_id", user.id);
      setHasMainVoted(false);
      setProduct((p) => p ? { ...p, votes_count: p.votes_count - 1 } : p);
    } else {
      await supabase.from("votes").insert({ startup_id: productId, user_id: user.id });
      setHasMainVoted(true);
      setProduct((p) => p ? { ...p, votes_count: p.votes_count + 1 } : p);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openSignIn();
      return;
    }
    if (!newCommentText.trim() || !session) return;

    const token = await session.getToken();
    const supabase = createClerkSupabaseClient(async () => token);

    const { error } = await supabase.from("comments").insert({
      startup_id: productId,
      user_id: user.id,
      author_name: user.fullName || user.firstName || user.username || "Anon",
      author_avatar: user.imageUrl || null,
      content: newCommentText.trim(),
    });

    if (!error) {
      setNewCommentText("");
      fetchComments();
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!user) {
      openSignIn();
      return;
    }
    if (!replyText.trim() || !session) return;

    const token = await session.getToken();
    const supabase = createClerkSupabaseClient(async () => token);

    const { error } = await supabase.from("comments").insert({
      startup_id: productId,
      user_id: user.id,
      author_name: user.fullName || user.firstName || user.username || "Anon",
      author_avatar: user.imageUrl || null,
      parent_id: parentId,
      content: replyText.trim(),
    });

    if (!error) {
      setReplyText("");
      setActiveReplyId(null);
      fetchComments();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session || !user) return;
    const token = await session.getToken();
    const supabase = createClerkSupabaseClient(async () => token);
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (!error) fetchComments();
  };

  const handleCommentVote = async (commentId: string, currentlyVoted: boolean) => {
    if (!user) {
      openSignIn();
      return;
    }
    if (!session) return;
    setVotingComment(commentId);
    const token = await session.getToken();
    const supabase = createClerkSupabaseClient(async () => token);

    if (currentlyVoted) {
      await supabase.from("comment_votes").delete().eq("comment_id", commentId).eq("user_id", user.id);
    } else {
      await supabase.from("comment_votes").insert({ comment_id: commentId, user_id: user.id });
    }

    setVotingComment(null);
    fetchComments();
  };

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Just now";
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const slides = product?.gallery_urls?.length
    ? product.gallery_urls
    : product?.logo_url
    ? [product.logo_url]
    : [];

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
        <Header />
        <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-[var(--surface-50)] border border-[var(--border)] animate-pulse" />
          ))}
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
        <Header />
        <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold font-display mb-4">Product not found</h1>
          <Link href="/" className="text-sm underline text-[var(--ink-500)]">Back to homepage</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const topLevelComments = comments.filter((c) => !c.parent_id);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />

      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
            {/* Logo */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-50)] flex items-center justify-center shadow-xs">
              {product.logo_url ? (
                <Image src={product.logo_url} alt={product.name} fill className="object-cover" />
              ) : (
                <span className="text-3xl font-bold font-display text-[var(--ink-900)]">
                  {product.name[0]}
                </span>
              )}
            </div>

            {/* Title & Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                  {product.name}
                </h1>
                {product.pricing_model && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFEDEA] text-[#FF6154] border border-[#FF6154]/20">
                    {product.pricing_model}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-[var(--ink-700)] mt-1 font-normal leading-relaxed">
                {product.tagline}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-[var(--ink-500)]">
                {product.categories?.map((cat) => (
                  <span key={cat} className="hover:text-[var(--ink-900)] transition-colors cursor-pointer">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visit Website */}
          <div className="shrink-0 w-full sm:w-auto flex items-center gap-3">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-50)] hover:bg-[var(--surface-100)] text-xs sm:text-sm font-bold font-display text-[var(--ink-900)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Visit website</span>
              <Icon icon="solar:export-linear" className="text-base text-[var(--ink-500)]" />
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="py-4 text-xs sm:text-sm text-[var(--ink-700)] leading-relaxed max-w-4xl">
          {product.description}
        </div>

        {/* Media / Gallery */}
        {slides.length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-50)] shadow-xs">
              <div className="relative aspect-video w-full">
                <Image
                  src={slides[currentSlide]}
                  alt={`${product.name} screenshot ${currentSlide + 1}`}
                  fill
                  className="object-cover"
                />
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
                    >
                      <Icon icon="solar:alt-arrow-left-linear" className="text-lg" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((p) => (p + 1) % slides.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
                    >
                      <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      currentSlide === idx ? "w-6 bg-[var(--ink-900)]" : "w-2 bg-[var(--border)] hover:bg-[var(--ink-300)]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags row */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-xs font-bold text-[var(--ink-500)] mr-1">Tags:</span>
            {product.categories.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface-50)] hover:bg-[var(--surface-100)] border border-[var(--border)] text-[var(--ink-700)] transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Comments */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-[var(--ink-900)] tracking-tight flex items-center gap-2">
                <span>Discussion</span>
                <span className="text-xs font-normal text-[var(--ink-500)] bg-[var(--surface-50)] px-2.5 py-0.5 rounded-full border border-[var(--border)] font-mono">
                  {topLevelComments.length}
                </span>
              </h2>
            </div>

            {/* Comment Input */}
            {user ? (
              <form
                onSubmit={handlePostComment}
                className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] space-y-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
                    {user.imageUrl ? (
                      <Image src={user.imageUrl} alt="You" width={36} height={36} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-ink-900 text-bg flex items-center justify-center text-sm font-bold">
                        {user.firstName?.[0] ?? "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="What do you think of this product?"
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--ink-900)] placeholder-[var(--ink-400)] focus:outline-none focus:border-[var(--ink-900)] resize-none h-20 transition-all font-body"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-5 py-2 bg-[var(--ink-900)] text-[var(--bg)] disabled:opacity-40 rounded-full text-xs font-bold font-display hover:opacity-90 transition-all cursor-pointer"
                  >
                    Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] text-center text-sm text-[var(--ink-500)]">
                <Link href="/sign-in" className="underline font-semibold text-[var(--ink-900)]">Sign in</Link> to join the discussion.
              </div>
            )}

            {/* Comment List */}
            <div className="space-y-6 pt-2">
              {topLevelComments.map((comment) => (
                <div key={comment.id} className="space-y-3 pb-6 border-b border-[var(--border)] last:border-b-0">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] shrink-0 mt-0.5 bg-[var(--surface-100)]">
                      {comment.author_avatar ? (
                        <Image src={comment.author_avatar} alt={comment.author_name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-ink-900 text-bg flex items-center justify-center text-sm font-bold">
                          {comment.author_name[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-display text-[var(--ink-900)]">
                            {comment.author_name}
                          </span>
                          <span className="text-xs text-[var(--ink-500)]">• {timeAgo(comment.created_at)}</span>
                        </div>
                        {/* Delete own comment */}
                        {user && comment.user_id === user.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-[var(--ink-400)] hover:text-red-500 transition-colors"
                          >
                            <Icon icon="solar:trash-bin-trash-linear" className="text-sm" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 text-xs font-medium text-[var(--ink-500)] pt-2.5">
                        <button
                          type="button"
                          disabled={!user || votingComment === comment.id}
                          onClick={() => handleCommentVote(comment.id, !!comment.hasVoted)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50 ${
                            comment.hasVoted
                              ? "bg-[var(--ink-900)] text-[var(--bg)] font-bold"
                              : "hover:bg-[var(--surface-50)] text-[var(--ink-700)] border border-[var(--border)]"
                          }`}
                        >
                          <UpvoteIcon filled={comment.hasVoted} className="text-xs" />
                          <span>Upvote ({comment.votes_count})</span>
                        </button>

                        {user && (
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                            className="hover:text-[var(--ink-900)] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Icon icon="solar:reply-linear" />
                            <span>Reply</span>
                          </button>
                        )}
                      </div>

                      {/* Reply Box */}
                      {activeReplyId === comment.id && (
                        <div className="mt-3 p-3 rounded-xl bg-[var(--surface-50)] border border-[var(--border)] space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author_name}...`}
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--ink-900)] focus:outline-none focus:border-[var(--ink-900)] resize-none h-16 font-body"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => { setActiveReplyId(null); setReplyText(""); }}
                              className="px-3 py-1 rounded-md text-xs font-medium text-[var(--ink-500)] hover:bg-[var(--surface-100)] cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePostReply(comment.id)}
                              disabled={!replyText.trim()}
                              className="px-4 py-1 rounded-md bg-[var(--ink-900)] text-[var(--bg)] text-xs font-bold disabled:opacity-50 cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 sm:ml-10 pl-4 border-l-2 border-[var(--border)] space-y-4 pt-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border)] shrink-0 mt-0.5 bg-[var(--surface-100)]">
                            {reply.author_avatar ? (
                              <Image src={reply.author_avatar} alt={reply.author_name} width={32} height={32} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-ink-900 text-bg flex items-center justify-center text-xs font-bold">
                                {reply.author_name[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold font-display text-[var(--ink-900)]">
                                  {reply.author_name}
                                </span>
                                <span className="text-xs text-[var(--ink-500)]">• {timeAgo(reply.created_at)}</span>
                              </div>
                              {user && reply.user_id === user.id && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="text-xs text-[var(--ink-400)] hover:text-red-500 transition-colors"
                                >
                                  <Icon icon="solar:trash-bin-trash-linear" className="text-sm" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--ink-700)] mt-1 leading-relaxed">
                              {reply.content}
                            </p>
                            <div className="flex items-center gap-3 text-xs font-medium text-[var(--ink-500)] pt-2">
                              <button
                                type="button"
                                disabled={!user || votingComment === reply.id}
                                onClick={() => handleCommentVote(reply.id, !!reply.hasVoted)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer disabled:opacity-50 ${
                                  reply.hasVoted
                                    ? "bg-[var(--ink-900)] text-[var(--bg)] font-bold"
                                    : "hover:bg-[var(--surface-50)] text-[var(--ink-700)] border border-[var(--border)]"
                                }`}
                              >
                                <UpvoteIcon filled={reply.hasVoted} className="text-[10px]" />
                                <span>{reply.votes_count}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {topLevelComments.length === 0 && (
                <p className="text-center text-[var(--ink-400)] text-sm py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Upvote Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 space-y-4 shadow-xs">
              <div className="text-center">
                <div className="text-[11px] font-bold text-[var(--ink-500)] uppercase tracking-wider mb-1">
                  Community Vote
                </div>
                <div className="text-3xl font-bold font-display text-[var(--ink-900)]">
                  {product.votes_count}
                </div>
                <div className="text-xs text-[var(--ink-500)]">upvotes</div>
              </div>

              <button
                type="button"
                onClick={handleMainVote}
                disabled={!user}
                className={`w-full py-3.5 rounded-xl font-bold font-display text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 duration-150 disabled:opacity-60 ${
                  hasMainVoted
                    ? "bg-[var(--ink-900)] text-[var(--bg)]"
                    : "bg-[#FF6154] hover:bg-[#FF4F40] text-white cursor-pointer"
                }`}
              >
                <UpvoteIcon filled={hasMainVoted} className="text-xl" />
                {hasMainVoted ? "Upvoted ✓" : "Upvote"}
              </button>

              {!user && (
                <p className="text-xs text-center text-[var(--ink-400)]">
                  <Link href="/sign-in" className="underline">Sign in</Link> to upvote
                </p>
              )}
            </div>

            {/* Product Info */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold font-display text-[var(--ink-900)]">Product Info</h3>
              <div className="space-y-2 text-xs text-[var(--ink-700)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--ink-500)]">Website</span>
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-900)] font-medium hover:underline truncate max-w-[150px]">
                    {product.url.replace(/^https?:\/\//, "")}
                  </a>
                </div>
                {product.pricing_model && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-500)]">Pricing</span>
                    <span className="font-medium">{product.pricing_model}</span>
                  </div>
                )}
                {product.twitter_handle && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-500)]">Twitter</span>
                    <a href={`https://twitter.com/${product.twitter_handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--ink-900)] hover:underline">
                      {product.twitter_handle}
                    </a>
                  </div>
                )}
                {product.launch_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-500)]">Launched</span>
                    <span className="font-medium">{new Date(product.launch_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Follow Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-50)] border border-[var(--border)] flex-wrap gap-4">
              <span className="text-xs font-medium text-[var(--ink-700)]">Follow this product</span>
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFollowing
                    ? "bg-[var(--ink-900)] text-[var(--bg)]"
                    : "border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--surface-100)]"
                }`}
              >
                <Icon icon={isFollowing ? "solar:check-circle-bold" : "solar:add-circle-linear"} className="text-sm" />
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}