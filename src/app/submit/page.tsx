"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/AppIcon";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "AfroPulse AI",
    url: "https://afropulse.ai",
    tagline: "Voice-first multilingual customer service for African languages",
    description:
      "AfroPulse AI enables businesses to automate voice and text support in Amharic, Oromo, Tigrinya, Swahili, and English with local dialect intelligence and real-time speech-to-text.",
    pricingModel: "Free Tier",
    twitterHandle: "@afropulse_ai",
    selectedCategories: ["AI & ML", "Productivity"],
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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

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
                Launch Scheduled! 🚀
              </h1>
              <p className="text-sm text-[var(--ink-500)] max-w-md mx-auto">
                <strong>{formData.name}</strong> is queued to launch on Addis Hunt tomorrow at 12:01 AM EAT. Check your email for your maker kit.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4">
              <Link
                href="/product/1"
                className="px-6 py-2.5 bg-[var(--ink-900)] text-[var(--bg)] rounded-full text-xs font-bold font-display hover:opacity-90"
              >
                View Preview Page
              </Link>
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
            {/* Header Section */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                Submit a Product to Addis Hunt
              </h1>
              <p className="text-xs sm:text-sm text-[var(--ink-500)] max-w-lg mx-auto">
                Join 500+ Ethiopian founders showcasing their products to tech enthusiasts, angels, and prospective customers.
              </p>
            </div>

            {/* Stepper matching Product Hunt */}
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
                        placeholder="e.g. Takata or PayStream"
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
                      placeholder="Concise, one-sentence description (max 70 characters)"
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
                      Product Logo (Square 240x240 recommended)
                    </label>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold flex items-center justify-center text-xl shrink-0">
                        {formData.name.charAt(0) || "A"}
                      </div>
                      <div className="space-y-1 text-xs text-[var(--ink-500)]">
                        <div className="font-semibold text-[var(--ink-900)]">Logo preview generated from initials</div>
                        <div>PNG, JPG, or SVG up to 5MB.</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold font-display text-[var(--ink-900)] uppercase tracking-wider">
                      Product Gallery / Screenshots
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-zinc-900 flex items-center justify-center p-2 text-center text-xs text-white">
                        <span>Slide 1: Hero Banner</span>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-zinc-800 flex items-center justify-center p-2 text-center text-xs text-white">
                        <span>Slide 2: Dashboard Preview</span>
                      </div>
                      <div className="border border-dashed border-[var(--border)] bg-[var(--bg)] rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-[var(--surface-100)] transition-colors">
                        <Icon icon="solar:camera-add-linear" className="text-2xl text-[var(--ink-400)] mb-1" />
                        <span className="text-[11px] font-bold text-[var(--ink-700)]">+ Add Screenshot</span>
                      </div>
                    </div>
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold flex items-center justify-center text-lg shrink-0">
                        {formData.name.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="text-base font-bold font-display text-[var(--ink-900)]">{formData.name}</div>
                        <div className="text-xs text-[var(--ink-500)]">{formData.tagline}</div>
                      </div>
                    </div>

                    <div className="text-xs text-[var(--ink-700)] leading-relaxed pt-2 border-t border-[var(--border)]">
                      {formData.description}
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {formData.pricingModel}
                      </span>
                      {formData.selectedCategories.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--surface-100)] text-[var(--ink-700)]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-[var(--ink-500)] p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    ⚡ By launching on Addis Hunt, your product will receive featured newsletter placement, social media promotion on X & Telegram, and real-time upvotes from founders.
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
                    className="px-6 py-2.5 bg-[var(--ink-900)] text-[var(--bg)] rounded-full text-xs font-bold font-display hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <Icon icon="solar:alt-arrow-right-linear" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-7 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-xs font-bold font-display hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                  >
                    <Icon icon="solar:rocket-bold" />
                    <span>Launch on Addis Hunt</span>
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