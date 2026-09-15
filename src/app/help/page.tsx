import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Help Center & FAQ — Addis Hunt",
  description:
    "Learn how to discover, submit, upvote, and launch startups on Addis Hunt.",
};

const faqs = [
  {
    q: "What is Addis Hunt?",
    a: "Addis Hunt is the daily stage for Ethiopian and African tech startups, software tools, and digital innovations. Makers launch products, the community upvotes the best ones, and everyone discovers what's new.",
  },
  {
    q: "How do I submit my startup?",
    a: "Sign in, go to Submit, and fill in your startup name, tagline, description, website URL, logo, categories, and pricing model. Submissions are reviewed before going live — we usually approve within 24–48 hours.",
  },
  {
    q: "Why is my submission still pending?",
    a: "Every submission goes through a quick human review for completeness, originality, and guideline compliance. Make sure you added a clear tagline, a working website, a logo, and at least one category. Rejected submissions can be edited and resubmitted.",
  },
  {
    q: "How does voting work?",
    a: "Each signed-in user gets one upvote per product (and one vote per comment). Upvotes determine daily and all-time rankings. Vote manipulation — fake accounts, vote-buying, coordinated brigading — is not allowed and will remove your votes.",
  },
  {
    q: "How do launches and rankings work?",
    a: "Products launch on the day they are approved. Votes earned push you up the daily leaderboard and the Recent Launches feed. Categories pages rank approved products by total votes.",
  },
  {
    q: "How do I create an account?",
    a: "Click Sign In in the header. We use Clerk for secure authentication, including email and Google sign-in. No password is stored on our servers.",
  },
  {
    q: "I found a bug or abusive content. What do I do?",
    a: "Use the report option on comments or products where available, and follow the Community Guidelines. For anything urgent, makers and hunters are expected to keep discussion respectful while we review.",
  },
  {
    q: "Is Addis Hunt free?",
    a: "Yes — discovering, voting, commenting, and submitting are free. Paid promoted placements and sponsorships may be offered in the future and will always be clearly labeled.",
  },
];

const guides = [
  {
    title: "Discover",
    body: "Browse the homepage feed, filter by Category, or check Recent Launches. Use search (Ctrl/⌘ + K) to find a startup by name or tagline.",
    href: "/categories",
    cta: "Browse categories",
  },
  {
    title: "Launch",
    body: "Prepare a sharp tagline, 2–3 screenshots or a logo, a working demo link, and your maker story. Launch early in the day (EAT) for maximum visibility.",
    href: "/submit",
    cta: "Submit your startup",
  },
  {
    title: "Engage",
    body: "Upvote what you genuinely like, leave thoughtful comments, and answer questions on your own launch. Makers who reply honestly earn far more trust — and votes.",
    href: "/launches",
    cta: "See recent launches",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />
      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-1">
            Help Center & FAQ
          </h1>
          <p className="text-sm font-medium text-[var(--ink-500)]">
            Everything you need to discover, launch, and grow on Addis Hunt.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {guides.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 space-y-2 shadow-xs"
            >
              <h2 className="text-sm font-bold font-display">{g.title}</h2>
              <p className="text-xs leading-relaxed text-[var(--ink-700)]">{g.body}</p>
              <Link
                href={g.href}
                className="inline-block text-xs font-bold underline underline-offset-2 hover:opacity-80"
              >
                {g.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 sm:p-7 shadow-xs">
          <h2 className="text-base font-bold font-display mb-4">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {faqs.map((f) => (
              <details key={f.q} className="py-3 group">
                <summary className="text-sm font-semibold cursor-pointer list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-[var(--ink-500)] group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="text-xs leading-relaxed text-[var(--ink-700)] mt-2 pr-6">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] p-5 text-xs text-[var(--ink-700)] leading-relaxed">
          Still stuck? Read our{" "}
          <Link href="/guidelines" className="font-bold underline underline-offset-2">
            Community Guidelines
          </Link>
          ,{" "}
          <Link href="/terms" className="font-bold underline underline-offset-2">
            Terms of Service
          </Link>
          , and{" "}
          <Link href="/privacy" className="font-bold underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </div>
      </main>
      <Footer />
    </div>
  );
}
