"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/AppIcon";
import { useUser, useClerk, useSession } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createAnonSupabaseClient, createClerkSupabaseClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/supabaseClient";

type Startup = Database["public"]["Tables"]["startups"]["Row"];

const tabs = [
  { id: "submissions", label: "Submissions" },
  { id: "upvoted", label: "Upvoted" },
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile, openSignIn } = useClerk();
  const { session } = useSession();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState<Startup[]>([]);
  const [upvoted, setUpvoted] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const username = params?.username as string;

  const isOwnProfile =
    user &&
    (user.username === username ||
      user.id === username ||
      `${user.firstName?.toLowerCase()}${user.lastName?.toLowerCase()}` === username.toLowerCase());

  const displayName = isOwnProfile
    ? user?.fullName || user?.firstName || username
    : username;

  const handle = isOwnProfile
    ? user?.username
      ? `@${user.username}`
      : user?.primaryEmailAddress?.emailAddress
    : `@${username}`;

  const avatarUrl = isOwnProfile ? user?.imageUrl : null;

  const bio = isOwnProfile
    ? "Product hunter on Addis Hunt. Discovering the next wave of African innovation."
    : "Product hunter on Addis Hunt.";

  const fetchData = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const supabase = createAnonSupabaseClient();

      if (isOwnProfile && user) {
        // Fetch own submissions
        const { data: subs } = await supabase
          .from("startups")
          .select("*")
          .eq("founder_id", user.id)
          .order("created_at", { ascending: false });

        setSubmissions(subs ?? []);

        // Fetch upvoted products
        const { data: voteRows } = await supabase
          .from("votes")
          .select("startup_id")
          .eq("user_id", user.id);

        if (voteRows && voteRows.length > 0) {
          const ids = voteRows.map((v) => v.startup_id);
          const { data: upvotedProducts } = await supabase
            .from("startups")
            .select("*")
            .in("id", ids)
            .order("votes_count", { ascending: false });
          setUpvoted(upvotedProducts ?? []);
        } else {
          setUpvoted([]);
        }
      } else {
        // Public profile: fetch their approved submissions only
        const { data: subs } = await supabase
          .from("startups")
          .select("*")
          .eq("founder_id", username)
          .eq("status", "approved")
          .order("created_at", { ascending: false });
        setSubmissions(subs ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isOwnProfile, user, username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (startupId: string) => {
    if (!session || !user) return;
    if (!confirm("Are you sure you want to delete this submission? This cannot be undone.")) return;

    setDeletingId(startupId);
    try {
      const token = await session.getToken();
      const supabase = createClerkSupabaseClient(async () => token);
      const { error } = await supabase.from("startups").delete().eq("id", startupId);
      if (!error) {
        setSubmissions((prev) => prev.filter((s) => s.id !== startupId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const currentItems = activeTab === "submissions" ? submissions : upvoted;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink-900">
      <Header />
      <main className="flex-grow w-full max-w-[var(--container-max)] mx-auto px-[var(--margin-mobile)] md:px-[var(--margin-desktop)] py-8 flex flex-col md:flex-row gap-8 lg:gap-10">
        {/* Sidebar / Profile Info */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0 flex flex-col gap-6 sticky top-24 h-max">
          <div className="flex flex-col items-start text-left w-full gap-4">
            {/* Avatar */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border bg-surface-100 shadow-sm">
              {!isLoaded ? (
                <div className="w-full h-full animate-pulse bg-surface-100" />
              ) : avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${displayName} profile photo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ink-900 text-bg text-6xl font-bold font-display">
                  {displayName?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Name & Handle */}
            <div className="w-full">
              {!isLoaded ? (
                <div className="h-7 w-36 bg-surface-100 rounded animate-pulse mb-2" />
              ) : (
                <h1 className="text-display-lg-mobile md:text-display-lg font-display text-ink-900 break-words">
                  {displayName}
                </h1>
              )}
              <p className="text-ink-500 text-body-lg font-body mt-1">{handle}</p>
            </div>

            {bio && (
              <p className="text-body-md font-body text-ink-700 w-full mt-1">{bio}</p>
            )}

            {/* Stats */}
            <div className="w-full flex items-center justify-around py-3 px-4 bg-surface-50 border border-border rounded-xl mt-1">
              <div className="flex flex-col items-center flex-1">
                <span className="text-ink-900 text-title-lg font-bold font-display">{submissions.length}</span>
                <span className="text-ink-500 text-[11px] uppercase tracking-wider font-semibold">Submissions</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center flex-1">
                <span className="text-ink-900 text-title-lg font-bold font-display">{upvoted.length}</span>
                <span className="text-ink-500 text-[11px] uppercase tracking-wider font-semibold">Upvoted</span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex gap-2 mt-2">
              {isOwnProfile ? (
                <button
                  onClick={() => openUserProfile()}
                  className="w-full bg-ink-900 text-bg py-2.5 px-4 rounded-lg text-label-lg font-display hover:bg-ink-700 transition-colors inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Icon icon="solar:pen-2-outline" className="text-base" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (!user) {
                        openSignIn();
                        return;
                      }
                      setIsFollowing(!isFollowing);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-label-lg font-display transition-colors cursor-pointer ${
                      isFollowing
                        ? "bg-surface-100 text-ink-900 border border-border hover:bg-surface-200"
                        : "bg-ink-900 text-bg hover:bg-ink-700"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        openSignIn();
                        return;
                      }
                    }}
                    className="p-2.5 border border-border rounded-lg text-ink-900 hover:bg-surface-100 transition-colors inline-flex items-center justify-center cursor-pointer"
                    aria-label="Send message"
                  >
                    <Icon icon="solar:chat-line-linear" className="text-base" />
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-border pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-body-md font-body pb-2 ${
                  activeTab === tab.id
                    ? "text-ink-900 font-bold border-b-2 border-ink-900 -mb-[10px]"
                    : "text-ink-500 font-medium hover:text-ink-900 transition-colors"
                }`}
              >
                {tab.label}{" "}
                <span className="ml-1 text-ink-400 font-normal">
                  ({activeTab === tab.id || tab.id === "submissions" ? submissions.length : upvoted.length})
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-lg bg-surface-50 border border-border animate-pulse" />
              ))
            ) : currentItems.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 text-center text-ink-400 py-12 text-sm">
                {activeTab === "submissions" ? "No submissions yet." : "No upvoted products yet."}
              </div>
            ) : (
              currentItems.map((item) => (
                <article
                  key={item.id}
                  className="group relative flex flex-col bg-surface-50 border border-border rounded-lg overflow-hidden hover:bg-surface-100 transition-colors duration-200"
                >
                  {/* Logo / Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-surface-100 border-b border-border">
                    {item.logo_url ? (
                      <Image
                        src={item.logo_url}
                        alt={`${item.name} logo`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-ink-900 text-bg text-5xl font-bold font-display">
                        {item.name[0]}
                      </div>
                    )}

                    {/* Status badge for own submissions */}
                    {isOwnProfile && (
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "approved"
                            ? "bg-emerald-500/90 text-white"
                            : item.status === "rejected"
                            ? "bg-red-500/90 text-white"
                            : "bg-amber-500/90 text-white"
                        }`}
                      >
                        {item.status ?? "pending"}
                      </span>
                    )}

                    {/* Delete button for own submissions */}
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title="Delete submission"
                      >
                        {deletingId === item.id ? (
                          <Icon icon="solar:loading-bold" className="text-sm animate-spin" />
                        ) : (
                          <Icon icon="solar:trash-bin-trash-linear" className="text-sm" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <Link href={`/product/${item.id}`} className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-title-lg font-display text-ink-900 group-hover:underline cursor-pointer">
                          {item.name}
                        </h3>
                        <p className="text-body-sm font-body text-ink-500 mt-1">
                          {item.categories?.[0] ?? "General"}
                        </p>
                      </div>
                      <div
                        className="flex flex-col items-center border rounded py-1 px-2 w-12 bg-surface-50 border-border"
                      >
                        <Icon icon="solar:arrow-up-linear" className="text-sm" />
                        <span className="text-label-lg font-display font-bold text-ink-900">
                          {item.votes_count}
                        </span>
                      </div>
                    </div>
                    <p className="text-body-sm text-ink-500 line-clamp-2">{item.tagline}</p>
                  </Link>
                </article>
              ))
            )}

            {/* Submit CTA — only show on own profile, submissions tab */}
            {isOwnProfile && activeTab === "submissions" && !loading && (
              <article className="col-span-1 sm:col-span-2 w-full group flex flex-col bg-surface-50/60 hover:bg-surface-100/70 border-2 border-dashed border-border hover:border-ink-400 rounded-xl items-center justify-center py-10 px-6 transition-all duration-200">
                <div className="text-center flex flex-col items-center max-w-md">
                  <div className="w-12 h-12 rounded-full bg-surface-100 border border-border flex items-center justify-center text-ink-600 mb-3 group-hover:scale-105 transition-transform">
                    <Icon icon="solar:add-circle-linear" className="text-2xl" />
                  </div>
                  <h3 className="text-title-lg font-display font-bold text-ink-900 mb-1">
                    Submit a new product
                  </h3>
                  <p className="text-body-sm font-body text-ink-500 mb-5">
                    Got something new to share with the community? Showcase your product to early adopters.
                  </p>
                  <Link
                    href="/submit"
                    className="px-5 py-2.5 bg-ink-900 text-bg text-label-lg font-display rounded-lg hover:bg-ink-700 transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    <Icon icon="solar:rocket-bold" className="text-sm" />
                    Start Submission
                  </Link>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}