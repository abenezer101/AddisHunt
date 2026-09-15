"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Icon } from "@/components/AppIcon";
import { useSession, useUser, useClerk } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

const steps = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Media & Assets" },
  { number: 3, label: "Categories" },
  { number: 4, label: "Review & Launch" },
];

const availableCategories = [
  "Fintech",
  "AI & ML",
  "Developer Tools",
  "Agritech",
  "Healthtech",
  "E-commerce",
  "Logistics",
  "Edtech",
  "Productivity",
  "Clean Energy",
];

export default function SubmitPage() {
  const router = useRouter();
  const { session } = useSession();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    tagline: "",
    description: "",
    pricingModel: "Free Tier",
    twitterHandle: "",
    selectedCategories: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(cat);
      if (exists) {
        return { ...prev, selectedCategories: prev.selectedCategories.filter((c) => c !== cat) };
      } else {
        return { ...prev, selectedCategories: [...prev.selectedCategories, cat] };
      }
    });
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Logo must be below 5MB.");
      return;
    }
    setError(null);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const MAX_GALLERY = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    // Reset input so the same file can be re-picked after removal
    e.target.value = "";

    const remaining = MAX_GALLERY - galleryFiles.length;
    if (remaining <= 0) {
      setError(`You can upload max ${MAX_GALLERY} demo screenshots.`);
      return;
    }

    const accepted: File[] = [];
    for (const file of files.slice(0, remaining)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" is over 5MB and was skipped.`);
        continue;
      }
      accepted.push(file);
    }

    if (files.length > remaining) {
      setError(`Only ${remaining} more image(s) allowed (max ${MAX_GALLERY}).`);
    } else if (accepted.length > 0) {
      setError(null);
    }

    if (accepted.length === 0) return;
    setGalleryFiles((prev) => [...prev, ...accepted]);
    setGalleryPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
  };

  const handleGalleryRemove = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !user) {
      setError("You must be signed in to submit a product.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await session.getToken();
      const supabase = createClerkSupabaseClient(async () => token);

      // Upload logo if provided
      let logoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, logoFile, { upsert: true });

        if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }

      // Upload gallery screenshots (max 5, each <5MB) — reuses product-images bucket
      const galleryUrls: string[] = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/gallery/${Date.now()}-${i}.${ext}`;
        const { error: galleryError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { upsert: true });

        if (galleryError) throw new Error(`Screenshot ${i + 1} upload failed: ${galleryError.message}`);

        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        galleryUrls.push(urlData.publicUrl);
      }

      // Insert startup
      const { data, error: insertError } = await supabase
        .from("startups")
        .insert({
          name: formData.name,
          tagline: formData.tagline,
          description: formData.description,
          url: formData.url,
          logo_url: logoUrl,
          founder_id: user.id,
          status: "pending",
          categories: formData.selectedCategories,
          pricing_model: formData.pricingModel,
          twitter_handle: formData.twitterHandle || null,
          gallery_urls: galleryUrls,
          launch_date: new Date().toISOString().split("T")[0],
          votes_count: 0,
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      setSubmittedId(data.id);
      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoaded && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
        <Header />
        <main className="flex-grow w-full max-w-[500px] mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center">
          <div className="w-full bg-[var(--surface-50)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[var(--ink-900)] text-[var(--bg)] flex items-center justify-center mx-auto text-3xl font-display font-bold">
              A
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)]">
                Authentication Required
              </h1>
              <p className="text-sm text-[var(--ink-500)] max-w-sm mx-auto">
                You need to be signed in to submit a new product and launch it on Addis Hunt.
              </p>
            </div>
            <button
              onClick={() => openSignIn()}
              className="w-full py-3 px-5 bg-[var(--ink-900)] text-[var(--bg)] rounded-xl text-sm font-bold font-display hover:opacity-90 transition-opacity shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Icon icon="solar:user-circle-linear" className="text-lg" />
              Sign in to Continue
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />

      <main className="flex-grow w-full max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {isSubmitted ? (
          <div className="w-full bg-[var(--surface-50)] border border-[var(--border)] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto text-3xl">
              <Icon icon="solar:check-circle-bold" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)]">
                Submission Received! 🚀
              </h1>
              <p className="text-sm text-[var(--ink-500)] max-w-md mx-auto">
                <strong>{formData.name}</strong> has been submitted for review. It will appear publicly once approved.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4">
              {submittedId && (
                <Link
                  href={`/product/${submittedId}`}
                  className="px-6 py-2.5 bg-[var(--ink-900)] text-[var(--bg)] rounded-full text-xs font-bold font-display hover:opacity-90"
                >
                  View Product Page
                </Link>
              )}
              <Link
                href="/"
                className="px-6 py-2.5 border border-[var(--border)] bg-[var(--bg)] rounded-full text-xs font-bold font-display text-[var(--ink-900)] hover:bg-[var(--surface-100)]"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-y-8 sm:gap-y-10">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                Submit a Product to Addis Hunt
              </h1>
              <p className="text-xs sm:text-sm text-[var(--ink-500)] max-w-lg mx-auto">
                Join Ethiopian founders showcasing their products to tech enthusiasts, angels, and prospective customers.
              </p>
            </div>

            {/* Stepper */}
            <div className="w-full flex items-center justify-between relative px-2 sm:px-6">
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-[var(--border)] -z-0"></div>
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center gap-y-1.5 bg-[var(--bg)] px-2 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display border transition-all ${
                      index + 1 < currentStep
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : index + 1 === currentStep
                        ? "bg-[var(--ink-900)] text-[var(--bg)] border-[var(--ink-900)] ring-4 ring-amber-500/20"
                        : "bg-[var(--surface-50)] text-[var(--ink-400)] border-[var(--border)]"
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <Icon icon="solar:check-read-linear" className="text-sm" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${
                      index + 1 <= currentStep ? "text-[var(--ink-900)]" : "text-[var(--ink-400)]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Form Card */}
            <form
              onSubmit={handleSubmit}
              className="w-full bg-[var(--surface-50)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col gap-y-6 shadow-sm"
            >
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] text-sm px-4 py-2.5 rounded-xl text-[var(--ink-900)] focus:outline-none focus:border-[var(--ink-900)]"
                        placeholder="e.g. BirrPay or AgriSense"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                        Website URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] text-sm px-4 py-2.5 rounded-xl text-[var(--ink-900)] focus:outline-none focus:border-[var(--ink-900)]"
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                      Catchy Tagline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      maxLength={70}
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] text-sm px-4 py-2.5 rounded-xl text-[var(--ink-900)] focus:outline-none focus:border-[var(--ink-900)]"
                      placeholder="Concise, one-sentence description (max 70 chars)"
                      required
                    />
                    <div className="text-[11px] text-[var(--ink-400)] flex justify-between">
                      <span>Appears under your product name across Addis Hunt.</span>
                      <span>{formData.tagline.length} / 70</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                      Description & Story
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] text-sm p-4 rounded-xl text-[var(--ink-900)] focus:outline-none focus:border-[var(--ink-900)] resize-none"
                      placeholder="What does your product do? What problem does it solve for Ethiopia and Africa?"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Media & Assets */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                      Product Logo (Square 240×240 recommended)
                    </label>
                    <div
                      className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] cursor-pointer hover:bg-[var(--surface-50)] transition-colors"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {logoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoPreview} alt="Logo preview" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold flex items-center justify-center text-xl shrink-0">
                          {formData.name.charAt(0) || "A"}
                        </div>
                      )}
                      <div className="space-y-1 text-xs text-[var(--ink-500)]">
                        <div className="font-semibold text-[var(--ink-900)]">
                          {logoFile ? logoFile.name : "Click to upload your logo"}
                        </div>
                        <div>PNG, JPG, WebP or SVG up to 5MB.</div>
                      </div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoSelect}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                      App Demo Screenshots (up to 5, each below 5MB)
                    </label>
                    <div
                      className="p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] cursor-pointer hover:bg-[var(--surface-50)] transition-colors"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <div className="flex items-center gap-3 text-xs text-[var(--ink-500)]">
                        <div className="w-10 h-10 rounded-xl bg-[var(--surface-100)] flex items-center justify-center shrink-0">
                          <Icon icon="solar:camera-add-linear" className="text-lg text-[var(--ink-700)]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--ink-900)]">
                            {galleryFiles.length > 0
                              ? `${galleryFiles.length} / 5 screenshots selected`
                              : "Click to upload demo screenshots"}
                          </div>
                          <div>PNG, JPG or WebP — shown in the product gallery carousel.</div>
                        </div>
                      </div>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGallerySelect}
                      />
                    </div>
                    {galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                        {galleryPreviews.map((src, i) => (
                          <div key={src} className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-100)] aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleGalleryRemove(i)}
                              aria-label={`Remove screenshot ${i + 1}`}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Categories & Pricing */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                      Select Primary Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((cat) => {
                        const isSelected = formData.selectedCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-[var(--ink-900)] text-[var(--bg)] shadow-xs"
                                : "bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-700)] hover:border-[var(--ink-900)]"
                            }`}
                          >
                            {cat} {isSelected && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                        Pricing Model
                      </label>
                      <select
                        name="pricingModel"
                        value={formData.pricingModel}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] text-sm px-4 py-2.5 rounded-xl text-[var(--ink-900)] focus:outline-none"
                      >
                        <option value="Free Tier">Free Tier / Freemium</option>
                        <option value="Free Trial">100% Free Trial</option>
                        <option value="Paid / Subscription">Paid / B2B Subscription</option>
                        <option value="Open Source">Open Source</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                        Maker Twitter / X Handle
                      </label>
                      <input
                        type="text"
                        name="twitterHandle"
                        value={formData.twitterHandle}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] text-sm px-4 py-2.5 rounded-xl text-[var(--ink-900)] focus:outline-none"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Launch */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-3">
                    <div className="flex items-center gap-3">
                      {logoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold flex items-center justify-center text-lg shrink-0">
                          {formData.name.charAt(0) || "A"}
                        </div>
                      )}
                      <div>
                        <div className="text-base font-bold font-display text-[var(--ink-900)]">{formData.name || "—"}</div>
                        <div className="text-xs text-[var(--ink-500)]">{formData.tagline || "—"}</div>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--ink-700)] leading-relaxed pt-2 border-t border-[var(--border)]">
                      {formData.description || "No description provided."}
                    </div>
                    {galleryPreviews.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {galleryPreviews.map((src, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={src} src={src} alt={`Screenshot ${i + 1}`} className="w-16 h-10 rounded-lg object-cover border border-[var(--border)]" />
                        ))}
                        <span className="text-[11px] text-[var(--ink-500)]">
                          {galleryPreviews.length} screenshot{galleryPreviews.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {formData.pricingModel}
                      </span>
                      {formData.selectedCategories.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--surface-100)] text-[var(--ink-700)]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--ink-500)] p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    ⚡ Your submission will be reviewed before going live. You&apos;ll receive featured placement, social promotion on X & Telegram, and real-time upvotes from the community.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 border border-[var(--border)] rounded-full text-xs font-bold font-display text-[var(--ink-900)] hover:bg-[var(--surface-100)] transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 1 && (!formData.name || !formData.url || !formData.tagline)}
                    className="px-6 py-2.5 bg-[var(--ink-900)] text-[var(--bg)] rounded-full text-xs font-bold font-display hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <Icon icon="solar:alt-arrow-right-linear" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-xs font-bold font-display hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Icon icon="solar:loading-bold" className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="solar:rocket-bold" />
                        <span>Launch on Addis Hunt</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}