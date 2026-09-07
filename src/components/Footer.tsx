"use client";

import Link from "next/link";
import { Icon } from "@/components/AppIcon";

const footerColumns = [
  {
    title: "Top Categories",
    links: [
      { label: "Software Engineering", href: "/categories" },
      { label: "AI & Machine Learning", href: "/categories" },
      { label: "Fintech & Payments", href: "/categories" },
      { label: "Developer Tools", href: "/categories" },
      { label: "Agritech & IoT", href: "/categories" },
      { label: "Productivity & Remote", href: "/categories" },
      { label: "E-commerce & Logistics", href: "/categories" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Trending Discussions", href: "/" },
      { label: "Upcoming Launches", href: "/launches" },
      { label: "Top Hunters Leaderboard", href: "/profile/kalkidandesigns" },
      { label: "Maker Directory", href: "/profile/kalkidandesigns" },
      { label: "Launch Guide & Checklist", href: "/submit" },
      { label: "Addis Tech Events 2026", href: "/" },
      { label: "Telegram Community", href: "https://t.me", external: true },
    ],
  },
  {
    title: "Advertise & Partners",
    links: [
      { label: "Advertise with Us", href: "/submit" },
      { label: "Promoted Placements", href: "/submit" },
      { label: "Newsletter Sponsorship", href: "/submit" },
      { label: "Media Kit & Pricing", href: "/submit" },
      { label: "Venture & Angels Club", href: "/" },
      { label: "Startup Act", href: "/" },
      { label: "Brand Assets", href: "/" },
    ],
  },
  {
    title: "Help & Legal",
    links: [
      { label: "Help Center & FAQ", href: "/" },
      { label: "Community Guidelines", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "Security & Trust", href: "/" },
      { label: "Cookie Preferences", href: "/" },
      { label: "Contact Support", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-gray-300 border-t border-gray-800 mt-auto pt-12 sm:pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Top Newsletter & Brand bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 border-b border-gray-800">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-gray-950 font-bold text-base flex items-center justify-center font-display tracking-tight">
                A
              </div>
              <span className="text-xl font-bold font-display text-white tracking-tight">
                Addis Hunt
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The daily stage for the most exciting tech startups, software tools, and digital innovations.
            </p>
          </div>

          <div className="w-full lg:w-auto space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Subscribe to the Daily Tech Dispatch
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center max-w-md w-full sm:w-80 bg-gray-900 border border-gray-700 rounded-full p-1 focus-within:border-gray-400 transition-colors"
            >
              <input
                type="email"
                placeholder="Enter your email..."
                className="bg-transparent pl-4 pr-24 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none flex-1 w-full"
              />
              <button
                type="submit"
                className="absolute right-1 bg-white hover:bg-gray-200 text-gray-950 px-4 py-1.5 rounded-full text-xs font-bold font-display transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* 4 Column Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-gray-800">
          {footerColumns.map((col) => (
            <div key={col.title} className="space-y-3.5">
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-500">
          <div>
            © 2026 Addis Hunt Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <div className="w-5 h-5 rounded-full bg-current text-[#0B1120] font-bold text-[11px] flex items-center justify-center font-display tracking-tighter">
                A
              </div>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="LinkedIn"
            >
              <Icon icon="ri:linkedin-fill" className="text-base" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="Telegram"
            >
              <Icon icon="ri:telegram-fill" className="text-base" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="GitHub"
            >
              <Icon icon="ri:github-fill" className="text-base" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="Discord"
            >
              <Icon icon="ri:discord-fill" className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}