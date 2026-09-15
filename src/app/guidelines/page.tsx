import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Community Guidelines — Addis Hunt",
  description:
    "The rules that keep Addis Hunt respectful, honest, and useful for makers and hunters.",
};

const sections = [
  {
    title: "1. Be respectful",
    body: [
      "Debate ideas, not people. No harassment, hate speech, threats, or personal attacks — including toward founders, teams, or other hunters.",
      "No discrimination based on ethnicity, religion, gender, disability, or background. Ethiopia's tech community is diverse; keep it welcoming.",
      "Criticism is welcome when it's specific and constructive ('onboarding took 4 steps, here's what confused me') rather than insulting.",
    ],
  },
  {
    title: "2. No spam or manipulation",
    body: [
      "One account per person. Fake accounts, vote-buying, vote-swapping rings, and coordinated brigading will have votes removed and accounts suspended.",
      "Don't spam comments with links, referral codes, or repeated self-promotion. Promote your own product only on its launch page, honestly labeled as the maker.",
      "No misleading submissions: no fake screenshots, fake testimonials, copied listings, or products you don't own or represent.",
    ],
  },
  {
    title: "3. Vote and comment honestly",
    body: [
      "Upvote products you genuinely find useful or exciting — not just friends' launches.",
      "Disclose conflicts: if you're the maker, an employee, or an investor, say so when commenting.",
      "Don't offer or accept payment, freebies, or equity in exchange for upvotes or positive comments.",
    ],
  },
  {
    title: "4. Maker conduct",
    body: [
      "Submit only real, working products with a live website or demo. Test links, Amharic/English copy, and mobile screenshots help a lot.",
      "Answer questions truthfully about pricing, data handling, and roadmap. Don't astroturf with fake hunter accounts.",
      "One active listing per product. Major relaunches (v2, new platform) may be submitted again — duplicates will be merged or removed.",
    ],
  },
  {
    title: "5. Keep it legal and safe",
    body: [
      "No pirated software, credential leaks, malware, gambling targeting minors, or content that violates Ethiopian law.",
      "No posting of private personal data (phone numbers, IDs, addresses) — yours or anyone else's.",
      "NSFW, graphic, or sexually explicit content is not allowed in listings, logos, screenshots, or comments.",
    ],
  },
  {
    title: "6. Reporting and enforcement",
    body: [
      "Report abuse via available reporting tools. Moderators may edit, hide, or remove content that breaks these rules.",
      "Enforcement ranges from warnings and vote removal to temporary suspension and permanent bans for repeat or severe violations.",
      "If your content was removed and you disagree, you may revise and resubmit once with the issue fixed.",
    ],
  },
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />
      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-1">
            Community Guidelines
          </h1>
          <p className="text-sm font-medium text-[var(--ink-500)]">
            Last updated: September 2026 · These rules apply to listings, comments, votes, and profiles.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 sm:p-7 mb-6 shadow-xs">
          <p className="text-sm leading-relaxed text-[var(--ink-700)]">
            Addis Hunt exists to spotlight Ethiopian and African builders. Hunters
            discover honestly, makers launch transparently, and everyone keeps the
            conversation useful. If content undermines trust in rankings or makes
            people feel unsafe, we will act — even if it isn&apos;t listed word-for-word below.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 sm:p-6 shadow-xs"
            >
              <h2 className="text-sm font-bold font-display mb-3">{s.title}</h2>
              <ul className="space-y-2">
                {s.body.map((line) => (
                  <li
                    key={line}
                    className="text-xs leading-relaxed text-[var(--ink-700)] flex gap-2"
                  >
                    <span aria-hidden="true" className="mt-0.5">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] p-5 text-xs text-[var(--ink-700)] leading-relaxed">
          By using Addis Hunt you also agree to our{" "}
          <Link href="/terms" className="font-bold underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-bold underline underline-offset-2">
            Privacy Policy
          </Link>
          . Questions? See the{" "}
          <Link href="/help" className="font-bold underline underline-offset-2">
            Help Center
          </Link>
          .
        </div>
      </main>
      <Footer />
    </div>
  );
}
