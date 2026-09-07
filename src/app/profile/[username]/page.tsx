"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/AppIcon";
import { useUser, useClerk } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useState } from "react";

const submissions = [
  {
    name: "BirrFlow",
    category: "Fintech",
    votes: 245,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9dUpxPNXbBuc1Tf-cNMewwpXOwQP6GgxluQGr2cZ-jvahTm7qJq8Maf0Jla_90I_Za38vo2uWYP_MXudu9WnOY6DfMLPcwNXxQRLe8gzARw5zeVpESyJx4rb5fNE5DKY7YViOTHFrnSW7qT6UPDieiajC2TOM7JK7qBoA0Mum5m3zZ9hBaC0V-rOBSndM1If1ml_SP4r8Niltd8QUy_0Wi164L_J-qdQag6LW1RvWXt9J0O30fQOtYw",
    imageAlt: "BirrFlow product screenshot",
    voted: false,
  },
  {
    name: "CropSense",
    category: "Hardware / Agritech",
    votes: 189,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkMDVE4dlKUaUBDb-l3tUhaIwBKBaGeC25k_V0zdOtN9IDmHuLFrSAgYidpPO9ZNwbwbmtwed8uHSWrJWrnyNt73AS5svRzxzPKDK1XEggp3UWeY5qt163hn1UqLzxmtk4lXyNMmvVsBtbXQ57Tp_x36-E7ULSzdpXLXYqhkTEfgh51HBmmjwz6OXT93WY-7yRrA1lfmk9uGcL8LrokfziUFGmxx5pFOmZ2I9Hn-P38JVh-Bo3JfuUcg",
    imageAlt: "CropSense product screenshot",
    voted: false,
  },
  {
    name: "LearnEthio",
    category: "EdTech",
    votes: 412,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfP6Xgr5gjeZ6hTXUihw9ET8OvlKWYClM-UirkaPbtjCUwFLM_jPWox6bd-A8QXtHBbbI0TMpUsOairuw6VDqPm-dvG4W70KXh5F9qB1dgsOdE3O-yUkLgc90rDYlWMYJ7onvsxvYIvtDF421w4SfPeeJGQn0bz5kdA5nKwg_khIGpAVTwdAbd3ZZuOR_VX2yz-uol-Hc0MbyVhfDbfr4utB8Y6TiDezH1FXA0IDViM-KzbeuUdfhtQ",
    imageAlt: "LearnEthio product screenshot",
    voted: true,
  },
];

const tabs = [
  { id: "submissions", label: "Submissions", count: 12 },
  { id: "upvoted", label: "Upvoted", count: 340 },
  { id: "collections", label: "Collections", count: 0 },
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("submissions");

  const username = params?.username as string;

  // Determine if this is the signed-in user's own profile
  const isOwnProfile =
    user &&
    (user.username === username ||
      user.id === username ||
      `${user.firstName?.toLowerCase()}${user.lastName?.toLowerCase()}` ===
        username.toLowerCase());

  // Profile data: real from Clerk if own profile, otherwise show username from URL
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

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink-900">
      <Header />
      <main className="flex-grow w-full max-w-[var(--container-max)] mx-auto px-[var(--margin-mobile)] md:px-[var(--margin-desktop)] py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar / Profile Info */}
        <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6 sticky top-24 h-max">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            {/* Avatar */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden border border-border bg-surface-100">
              {!isLoaded ? (
                <div className="w-full h-full animate-pulse bg-surface-100" />
              ) : avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${displayName} profile photo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 192px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ink-900 text-bg text-5xl font-bold font-display">
                  {displayName?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Name & Handle */}
            <div>
              {!isLoaded ? (
                <div className="h-7 w-36 bg-surface-100 rounded animate-pulse mb-2" />
              ) : (
                <h1 className="text-display-lg-mobile md:text-display-lg font-display text-ink-900">
                  {displayName}
                </h1>
              )}
              <p className="text-ink-500 text-body-lg font-body mt-1">{handle}</p>
            </div>

            <p className="text-body-lg font-body text-ink-700 max-w-sm mt-2">{bio}</p>

            {/* Stats */}
            <div className="flex flex-row items-center gap-6 mt-4">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-ink-900 text-body-lg font-bold">1.2k</span>
                <span className="text-ink-500 text-body-sm">Followers</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center md:items-start">
                <span className="text-ink-900 text-body-lg font-bold">450</span>
                <span className="text-ink-500 text-body-sm">Following</span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex gap-2 mt-6">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => openUserProfile()}
                    className="flex-1 bg-ink-900 text-bg py-2 px-4 rounded text-label-lg font-display hover:bg-ink-700 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:settings-linear" className="text-base" />
                    Edit Profile
                  </button>
                  <Link
                    href="/submit"
                    className="p-2 border border-border rounded text-ink-900 hover:bg-surface-100 transition-colors flex items-center justify-center"
                    title="Submit a product"
                  >
                    <Icon icon="solar:add-circle-linear" className="text-base" />
                  </Link>
                </>
              ) : (
                <>
                  <button className="flex-1 bg-ink-900 text-bg py-2 px-4 rounded text-label-lg font-display hover:bg-ink-700 transition-colors">
                    Follow
                  </button>
                  <button className="p-2 border border-border rounded text-ink-900 hover:bg-surface-100 transition-colors">
                    <Icon icon="solar:chat-line-linear" className="text-base" />
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
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
                <span className="ml-1 text-ink-400 font-normal">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Submissions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {submissions.map((submission) => (
              <article
                key={submission.name}
                className="group relative flex flex-col bg-surface-50 border border-border rounded-lg overflow-hidden hover:bg-surface-100 transition-colors duration-200"
              >
                <div className="relative h-48 w-full overflow-hidden bg-surface-100 border-b border-border">
                  <Image
                    src={submission.image}
                    alt={submission.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-title-lg font-display text-ink-900 group-hover:underline cursor-pointer">
                        {submission.name}
                      </h3>
                      <p className="text-body-sm font-body text-ink-500 mt-1">
                        {submission.category}
                      </p>
                    </div>
                    <button
                      className={`flex flex-col items-center border rounded py-1 px-2 w-12 cursor-pointer transition-colors ${
                        submission.voted
                          ? "bg-ink-900 text-bg border-ink-900"
                          : "bg-surface-50 hover:bg-surface-100 border-border"
                      }`}
                    >
                      <Icon
                        icon={
                          submission.voted
                            ? "solar:arrow-up-bold"
                            : "solar:arrow-up-linear"
                        }
                        className="text-sm"
                      />
                      <span
                        className={`text-label-lg font-display font-bold ${
                          submission.voted ? "text-bg" : "text-ink-900"
                        }`}
                      >
                        {submission.votes}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Submit CTA */}
            <article className="group flex flex-col bg-surface-50 border border-dashed border-border rounded-lg items-center justify-center min-h-[300px]">
              <div className="text-center p-6 flex flex-col items-center">
                <Icon icon="solar:add-circle-linear" className="text-4xl text-ink-300 mb-2" />
                <h3 className="text-title-lg font-display text-ink-500 mb-1">
                  Submit a new product
                </h3>
                <p className="text-body-sm font-body text-ink-400">
                  Got something new to share with the community?
                </p>
                <Link
                  href="/submit"
                  className="mt-4 px-4 py-2 border border-ink-900 text-ink-900 text-label-lg font-display rounded hover:bg-surface-100 transition-colors"
                >
                  Start Submission
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}