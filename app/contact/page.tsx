"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { contactInfo } from "@/lib/content/site";

type SubmitStatus = {
  success?: boolean;
  message?: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});

    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;
    const formValues = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();

      if (!response.ok) {
        setSubmitStatus({
          success: false,
          message: data.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setSubmitStatus({
        success: true,
        message: "Thank you. Ajay will get back to you soon.",
      });
      form.reset();
    } catch {
      setSubmitStatus({
        success: false,
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
            Contact
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#eeeef0] sm:text-6xl">
            Have a question before you enroll?
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#b5b2bc]">
            Send a note about coaching, programs, availability, or anything you
            need to understand before starting.
          </p>
          <Link
            href="/enroll"
            className="mt-8 inline-flex rounded-full bg-[#eeeef0] px-7 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
          >
            Or start enrollment
          </Link>

          <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b5b2bc]">
                Prefer to talk?
              </p>
              <a
                href={contactInfo.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-[#eeeef0] transition hover:bg-[#eeeef0] hover:text-[#1a191b]"
              >
                Book a free 30-min call →
              </a>
            </div>
            <p className="text-sm text-[#b5b2bc]">
              Call or WhatsApp:{" "}
              <a
                href={contactInfo.phoneHref}
                className="font-semibold text-[#eeeef0] underline-offset-2 hover:underline"
              >
                {contactInfo.phone}
              </a>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/10 bg-[#232225] p-5 shadow-xl shadow-black/40 sm:p-8"
        >
          {submitStatus.message && (
            <div
              className={`mb-6 rounded-3xl p-4 text-sm ${
                submitStatus.success
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-rose-50 text-rose-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#c9c7cf]">Name</span>
              <input
                name="name"
                required
                className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#c9c7cf]">Email</span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
              />
            </label>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-sm font-medium text-[#c9c7cf]">Subject</span>
            <input
              name="subject"
              required
              className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
            />
          </label>

          <label className="mt-5 block space-y-2">
            <span className="text-sm font-medium text-[#c9c7cf]">Message</span>
            <textarea
              name="message"
              rows={6}
              required
              className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-[#eeeef0] px-6 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
