import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Addis Hunt",
  description: "How Addis Hunt collects, uses, and protects your data.",
};

const sections = [
  {
    title: "1. Data we collect",
    body: [
      "Account data (via Clerk): name, username, email address, profile image, and authentication identifiers when you sign in with email or Google.",
      "Content you provide: startup submissions (names, taglines, descriptions, URLs, logos), comments, votes, and profile details.",
      "Automatic data: device and browser info, pages viewed, and approximate usage analytics needed to run and secure the service.",
      "We do not collect passwords directly — authentication is handled by Clerk. We do not ask for government IDs or payment details.",
    ],
  },
  {
    title: "2. How we use data",
    body: [
      "To operate Addis Hunt: accounts, listings, voting, comments, rankings, and search.",
      "To moderate: detect spam, fake accounts, and vote manipulation, and enforce our Community Guidelines.",
      "To improve: understand which categories and launches perform well and fix bugs.",
      "To communicate: transactional emails such as submission approvals or security notices. Marketing emails (e.g. the Daily Tech Dispatch) are opt-in.",
    ],
  },
  {
    title: "3. Image and file storage",
    body: [
      "Logos and screenshots you upload are stored in Supabase Storage (public product-images bucket) so listings load quickly.",
      "Files you upload should not contain personal data of third parties. Public listing assets are visible to anyone on the internet.",
    ],
  },
  {
    title: "4. Cookies and similar tech",
    body: [
      "We and our providers (Clerk for sessions, Supabase for infrastructure) use cookies and local storage to keep you signed in, remember preferences, and secure the platform.",
      "Next.js may cache optimized images to speed up loading. You can clear cookies in your browser, but sign-in and voting will stop working without them.",
    ],
  },
  {
    title: "5. Sharing",
    body: [
      "Public by design: your username, listings, comments, and vote counts are visible to other users.",
      "Providers: Clerk (authentication), Supabase (database and storage), and hosting/analytics infrastructure — only what they need to provide their service.",
      "Legal: we may disclose data if required by Ethiopian law or to protect users and the platform from harm or fraud. We never sell personal data.",
    ],
  },
  {
    title: "6. Retention and your rights",
    body: [
      "We keep account and content data while your account is active and as needed to run rankings and prevent abuse.",
      "You can edit your profile, delete your comments and drafts, and manage your Clerk account at any time. Deleting your account removes your profile; some anonymized aggregate counts (e.g. total votes) may remain.",
      "To request access, correction, or deletion of personal data, manage it in your account settings or raise it via the Help Center.",
    ],
  },
  {
    title: "7. Security and children",
    body: [
      "We use HTTPS, provider-managed access controls (Row Level Security on Supabase), and least-privilege keys. No system is perfectly secure — use a strong, unique password and enable available 2FA with your identity provider.",
      "Addis Hunt is not directed at children under 13. Accounts for underage users will be removed.",
    ],
  },
  {
    title: "8. Changes to this policy",
    body: [
      "We will update the 'Last updated' date when this policy changes. Material changes will be highlighted in-product or via the Help Center. Continued use after changes means you accept the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />
      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-1">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-[var(--ink-500)]">
            Last updated: September 2026 · Addis Hunt Inc.
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
          Related:{" "}
          <Link href="/terms" className="font-bold underline underline-offset-2">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/guidelines" className="font-bold underline underline-offset-2">
            Community Guidelines
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
