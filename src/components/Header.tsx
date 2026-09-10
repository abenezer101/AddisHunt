"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/components/AppIcon";
import SearchModal from "./SearchModal";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-[var(--bg)] border-b border-[var(--border)] sticky top-0 z-40">
        <div className="page-container h-16 2xl:h-20 flex justify-between items-center gap-4 lg:gap-8">
          {/* Left: Brand logo + Search */}
          <div className="flex items-center gap-4 flex-1 max-w-xl 2xl:max-w-2xl">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group cursor-pointer">
              <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-full bg-[var(--ink-900)] text-[var(--bg)] font-bold text-xl 2xl:text-2xl flex items-center justify-center font-display tracking-tighter group-hover:opacity-90 transition-opacity">
                A
              </div>
              <span className="text-xl 2xl:text-2xl font-bold font-display text-[var(--ink-900)] tracking-tight hidden sm:inline-block">
                Addis Hunt
              </span>
            </Link>

            {/* Search bar matching ctrl+k style */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="relative flex-1 max-w-md 2xl:max-w-lg hidden sm:flex items-center justify-between bg-[var(--surface-50)] hover:bg-[var(--surface-100)] border border-transparent hover:border-[var(--border)] rounded-full pl-3.5 pr-3 py-2 2xl:py-2.5 text-sm text-[var(--ink-500)] transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:magnifer-linear" className="text-lg 2xl:text-xl text-[var(--ink-500)]" />
                <span className="text-sm 2xl:text-base text-[var(--ink-500)]">Search ( ctrl + k )</span>
              </div>
            </button>
          </div>

          {/* Center: Nav links with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* 1. Best Products Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("best")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/categories"
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname === "/categories" || activeDropdown === "best"
                    ? "text-[var(--ink-900)] font-semibold"
                    : "text-[var(--ink-700)] hover:text-[var(--ink-900)]"
                }`}
              >
                Best Products
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className={`text-xs transition-transform duration-200 ${
                    activeDropdown === "best" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "best" && (
                <div className="absolute top-full left-0 pt-2 w-[440px] animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-[var(--ink-500)] uppercase tracking-wider px-2 py-1">
                        Leaderboards
                      </div>
                      <Link
                        href="/"
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-50)] transition-colors cursor-pointer text-xs font-semibold text-[var(--ink-900)]"
                      >
                        <Icon icon="solar:cup-star-bold" className="text-sm text-[var(--ink-900)]" />
                        Top Products Today
                      </Link>
                      <Link
                        href="/categories"
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-50)] transition-colors cursor-pointer text-xs font-semibold text-[var(--ink-900)]"
                      >
                        <Icon icon="solar:medal-ribbon-bold" className="text-sm text-[var(--ink-900)]" />
                        Product of the Week
                      </Link>
                      <Link
                        href="/categories"
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-50)] transition-colors cursor-pointer text-xs font-semibold text-[var(--ink-900)]"
                      >
                        <Icon icon="solar:crown-star-bold" className="text-sm text-[var(--ink-900)]" />
                        Hall of Fame
                      </Link>
                    </div>

                    <div className="space-y-1 border-l border-[var(--border)] pl-2">
                      <div className="text-[11px] font-bold text-[var(--ink-500)] uppercase tracking-wider px-2 py-1">
                        Categories
                      </div>
                      <Link
                        href="/categories"
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] cursor-pointer text-xs text-[var(--ink-700)] hover:text-[var(--ink-900)] font-medium"
                      >
                        <span>Fintech & Payments</span>
                        <span className="text-[10px] bg-[var(--surface-100)] px-1.5 py-0.5 rounded">42</span>
                      </Link>
                      <Link
                        href="/categories"
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] cursor-pointer text-xs text-[var(--ink-700)] hover:text-[var(--ink-900)] font-medium"
                      >
                        <span>AI & ML Tools</span>
                        <span className="text-[10px] bg-[var(--surface-100)] px-1.5 py-0.5 rounded">28</span>
                      </Link>
                      <Link
                        href="/categories"
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] cursor-pointer text-xs text-[var(--ink-700)] hover:text-[var(--ink-900)] font-medium"
                      >
                        <span>Developer Tools</span>
                        <span className="text-[10px] bg-[var(--surface-100)] px-1.5 py-0.5 rounded">19</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Launches Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("launches")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/launches"
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname === "/launches" || activeDropdown === "launches"
                    ? "text-[var(--ink-900)] font-semibold"
                    : "text-[var(--ink-700)] hover:text-[var(--ink-900)]"
                }`}
              >
                Launches
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className={`text-xs transition-transform duration-200 ${
                    activeDropdown === "launches" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "launches" && (
                <div className="absolute top-full left-0 pt-2 w-[320px] animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl p-3 space-y-1">
                    <Link
                      href="/launches"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--surface-50)] transition-colors cursor-pointer text-xs font-semibold text-[var(--ink-900)]"
                    >
                      <Icon icon="solar:rocket-bold" className="text-base text-[var(--ink-900)]" />
                      <span>Launch Archive</span>
                    </Link>
                    <Link
                      href="/launches"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--surface-50)] transition-colors cursor-pointer text-xs font-semibold text-[var(--ink-900)]"
                    >
                      <Icon icon="solar:calendar-date-bold" className="text-base text-[var(--ink-900)]" />
                      <span>Upcoming Launches</span>
                    </Link>
                    <Link
                      href="/submit"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--surface-50)] transition-colors cursor-pointer text-xs font-semibold text-[var(--ink-900)]"
                    >
                      <Icon icon="solar:checklist-minimalistic-bold" className="text-base text-[var(--ink-900)]" />
                      <span>Launch Guide & Checklist</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. News & For you */}
            <Link
              href="/"
              className="text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] transition-colors cursor-pointer"
            >
              News
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] transition-colors cursor-pointer"
            >
              For you
            </Link>

            {/* 4. Advertise Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("advertise")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activeDropdown === "advertise"
                    ? "text-[var(--ink-900)] font-semibold"
                    : "text-[var(--ink-700)] hover:text-[var(--ink-900)]"
                }`}
              >
                Advertise
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className={`text-xs transition-transform duration-200 ${
                    activeDropdown === "advertise" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "advertise" && (
                <div className="absolute top-full right-0 pt-2 w-[300px] animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl p-3 space-y-1">
                    <Link
                      href="/submit"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--surface-50)] cursor-pointer text-xs text-[var(--ink-900)] font-semibold"
                    >
                      <Icon icon="solar:stars-minimalistic-bold" className="text-sm" />
                      <span>Promoted Top Placement</span>
                    </Link>
                    <Link
                      href="/submit"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--surface-50)] cursor-pointer text-xs text-[var(--ink-900)] font-semibold"
                    >
                      <Icon icon="solar:letter-bold" className="text-sm" />
                      <span>Newsletter Sponsorship</span>
                    </Link>
                    <Link
                      href="/submit"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--surface-50)] cursor-pointer text-xs text-[var(--ink-900)] font-semibold"
                    >
                      <Icon icon="solar:graph-up-bold" className="text-sm" />
                      <span>Media Kit & Pricing</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Search button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 rounded-full hover:bg-[var(--surface-50)] text-[var(--ink-900)] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Icon icon="solar:magnifer-linear" className="text-xl" />
            </button>

            {/* Notification Bell — only shown when signed in */}
            {isSignedIn && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-[var(--surface-50)] text-[var(--ink-700)] hover:text-[var(--ink-900)] transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Icon icon="solar:bell-linear" className="text-xl" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--ink-900)]"></span>
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold font-display text-[var(--ink-900)]">Notifications</span>
                      <span className="text-[10px] text-[var(--ink-500)] cursor-pointer hover:text-[var(--ink-900)]">
                        Mark all read
                      </span>
                    </div>
                    <div className="py-2 space-y-2">
                      <div className="p-2 rounded-xl bg-[var(--surface-50)] text-xs flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--ink-900)] mt-1.5 shrink-0"></div>
                        <div>
                          <span className="font-semibold text-[var(--ink-900)]">Tidaro</span> was upvoted by 12 hunters today.
                          <div className="text-[10px] text-[var(--ink-500)] mt-0.5">10m ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clerk Auth & Action Controls */}
            {isSignedIn ? (
              <>
                {/* Submit button — directly navigates to /submit for signed-in users */}
                <Link
                  href="/submit"
                  className="bg-[var(--ink-900)] text-[var(--bg)] px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 duration-150 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Icon icon="solar:add-circle-linear" className="text-base" />
                  <span>Submit</span>
                </Link>

                {/* Profile Avatar / Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] hover:opacity-90 transition-opacity inline-flex shrink-0 cursor-pointer items-center justify-center bg-[var(--ink-900)]"
                    aria-label="Account menu"
                  >
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName ?? "Profile"}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[var(--bg)] text-sm font-bold">
                        {user?.firstName?.[0] ?? user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    )}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                      {/* User info */}
                      <div className="p-2.5 border-b border-[var(--border)] flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--ink-900)] flex items-center justify-center">
                          {user?.imageUrl ? (
                            <Image
                              src={user.imageUrl}
                              alt={user.fullName ?? ""}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[var(--bg)] text-xs font-bold">
                              {user?.firstName?.[0] ?? "?"}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-[var(--ink-900)] font-display truncate">
                            {user?.fullName || user?.firstName || "Hunter"}
                          </div>
                          <div className="text-[11px] text-[var(--ink-500)] truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </div>
                        </div>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          href={`/profile/${user?.username || user?.id}`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:bg-[var(--surface-50)] cursor-pointer transition-colors"
                        >
                          <Icon icon="solar:user-circle-linear" className="text-sm shrink-0" />
                          View Profile
                        </Link>
                        <Link
                          href="/submit"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:bg-[var(--surface-50)] cursor-pointer transition-colors"
                        >
                          <Icon icon="solar:box-linear" className="text-sm shrink-0" />
                          My Submissions
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            openUserProfile();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:bg-[var(--surface-50)] cursor-pointer transition-colors"
                        >
                          <Icon icon="solar:settings-linear" className="text-sm shrink-0" />
                          Account Settings
                        </button>
                      </div>

                      <div className="border-t border-[var(--border)] mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <Icon icon="solar:logout-2-linear" className="text-sm shrink-0" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* When not signed in: Submit button (opens Sign-up modal) + Sign in button (opens Sign-in modal) */
              <div className="flex items-center gap-2">
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="bg-[var(--ink-900)] text-[var(--bg)] px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 duration-150 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="solar:add-circle-linear" className="text-base" />
                    <span>Submit</span>
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="text-xs sm:text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] transition-colors cursor-pointer px-3 py-2 rounded-full hover:bg-[var(--surface-50)]"
                  >
                    Sign in
                  </button>
                </SignInButton>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-[var(--surface-50)] text-[var(--ink-900)] transition-colors cursor-pointer ml-1"
              aria-label="Toggle menu"
            >
              <Icon
                icon={isMobileMenuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"}
                className="text-2xl"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)] px-5 py-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between bg-[var(--surface-50)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--ink-500)] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Icon icon="solar:magnifer-linear" className="text-base" /> Search products...
              </span>
              <span className="font-mono text-[10px] bg-[var(--bg)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                Ctrl+K
              </span>
            </button>

            <div className="space-y-1 font-medium text-sm">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] text-[var(--ink-900)] cursor-pointer"
              >
                <span>Best Products Today</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </Link>
              <Link
                href="/launches"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] text-[var(--ink-900)] cursor-pointer"
              >
                <span>Launches</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </Link>
              <Link
                href="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] text-[var(--ink-900)] cursor-pointer"
              >
                <span>Categories</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </Link>
              <Link
                href="/submit"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] text-[var(--ink-900)] cursor-pointer"
              >
                <span>Submit a Product</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </Link>
              <Link
                href="/profile/kalkidandesigns"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] text-[var(--ink-900)] cursor-pointer"
              >
                <span>Profile</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}