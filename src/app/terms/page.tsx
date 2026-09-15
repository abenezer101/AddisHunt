import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Addis Hunt",
  description: "The terms governing your use of Addis Hunt.",
};

const sections = [
  {
    title: "1. Acceptance and eligibility",
    body: "By accessing or using Addis Hunt you agree to these Terms and to our Community Guidelines and Privacy Policy. You must be at least 13 years old (or the minimum age in your country) to use the service. If you use Addis Hunt on behalf of a company, you confirm you are authorized to bind that company.",
  },
  {
    title: "2. Your account",
    body: "Authentication is provided by Clerk (email, Google, and other supported methods). You are responsible for activity under your account and for keeping your credentials secure. One account per person. We may suspend accounts that share credentials abusively, impersonate others, or evade prior suspensions.",
  },
  {
    title: "3. Submissions and licenses",
    body: "When you submit a startup — name, tagline, description, URLs, logos, and screenshots — you confirm you own or have the right to share that content and that it is accurate. You grant Addis Hunt a worldwide, non-exclusive, royalty-free license to host, display, resize, and promote your submission on the platform and in promotional channels (e.g. newsletters, social posts). You keep ownership of your IP. We may reject, edit metadata for clarity, merge duplicates, or remove listings that violate our Guidelines.",
  },
  {
    title: "4. Voting, comments, and fair use",
    body: "Votes and comments must reflect genuine opinion. You agree not to create fake accounts, buy or sell votes, run vote-swapping schemes, scrape or spam the service, or interfere with rankings. We may invalidate votes, hide comments, rate-limit, or suspend accounts that manipulate the platform.",
  },
  {
    title: "5. Prohibited conduct",
    body: "You agree not to: break the law; post infringing, defamatory, hateful, or NSFW material; upload malware; attempt to access other users' accounts or non-public systems; scrape at abusive rates; or misrepresent your affiliation with a product. Makers must disclose material connections when promoting their own products.",
  },
  {
    title: "6. Intellectual property and takedowns",
    body: "Addis Hunt's branding, design, and code belong to Addis Hunt Inc. Product names, logos, and screenshots belong to their respective owners. If you believe content infringes your rights, tell us which listing or comment, your relationship to the work, and contact details so we can review. Repeat infringers will be removed.",
  },
  {
    title: "7. Third-party links and services",
    body: "Listings link to external websites, app stores, and payment pages we don't control. We are not responsible for third-party content, availability, pricing, or data practices. Storage and database services are provided via Supabase; authentication via Clerk — their terms and policies apply to those layers.",
  },
  {
    title: "8. Termination",
    body: "You may stop using Addis Hunt at any time and request account deletion via your Clerk profile settings. We may suspend or terminate access for Guideline or Terms violations, legal requirements, or to protect the platform. Sections on licenses, liability, and dispute handling survive termination.",
  },
  {
    title: "9. Disclaimers and limitation of liability",
    body: "Addis Hunt is provided 'as is' without warranties of any kind. We don't guarantee uptime, ranking outcomes, funding, or that listings are error-free. To the maximum extent allowed by law, Addis Hunt Inc. is not liable for indirect, incidental, or consequential damages arising from your use of the service.",
  },
  {
    title: "10. Changes and contact",
    body: "We may update these Terms as the platform evolves; material changes will be reflected by the 'Last updated' date and, where appropriate, in-product notice. Continued use after changes means you accept the new Terms. For questions about these Terms, see the Help Center.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />
      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-1">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-[var(--ink-500)]">
            Last updated: September 2026 · Operated by Addis Hunt Inc.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 sm:p-6 shadow-xs"
            >
              <h2 className="text-sm font-bold font-display mb-2">{s.title}</h2>
              <p className="text-xs leading-relaxed text-[var(--ink-700)]">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] p-5 text-xs text-[var(--ink-700)] leading-relaxed">
          Related:{" "}
          <Link href="/guidelines" className="font-bold underline underline-offset-2">
            Community Guidelines
          </Link>
          {" · "}
          <Link href="/privacy" className="font-bold underline underline-offset-2">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/help" className="font-bold underline underline-offset-2">
            Help Center
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
