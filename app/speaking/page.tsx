"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import CallButton from "@/components/site/call-button";
import { contactInfo, speakingContent, trainerImages } from "@/lib/content/site";

type SubmitStatus = {
  success?: boolean;
  message?: string;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10";

export default function SpeakingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formValues = {
      organization: String(formData.get("organization") || ""),
      contactName: String(formData.get("contactName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      eventType: String(formData.get("eventType") || ""),
      eventDate: String(formData.get("eventDate") || ""),
      audienceSize: String(formData.get("audienceSize") || ""),
      location: String(formData.get("location") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();

      if (!response.ok) {
        setSubmitStatus({
          success: false,
          message:
            data.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setSubmitStatus({
        success: true,
        message:
          "Thank you. Ajay will get back to you about the event shortly.",
      });
      form.reset();
    } catch {
      setSubmitStatus({
        success: false,
        message: "Failed to send inquiry. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#121113]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
                {speakingContent.hero.eyebrow}
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#eeeef0] sm:text-6xl">
                {speakingContent.hero.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#b5b2bc]">
                {speakingContent.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={speakingContent.hero.primaryCta.href}
                  className="inline-flex rounded-full bg-[#eeeef0] px-7 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
                >
                  {speakingContent.hero.primaryCta.label}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#232225] shadow-2xl shadow-black/40">
              <Image
                src={trainerImages.hero.src}
                alt="Ajay Pal Singh, speaker and coach"
                fill
                placeholder="blur"
                blurDataURL={trainerImages.hero.blurDataURL}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="bg-[#121113] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
                Talks and themes
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
                Stories that land. Ideas that stick.
              </h2>
              <p className="mt-5 max-w-2xl text-[#b5b2bc]">
                Each talk is shaped around your audience: leadership team,
                whole company, founders, or community.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {speakingContent.topics.map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-[1.75rem] border border-white/10 bg-[#232225] p-6 transition hover:border-white/20"
                >
                  <h3 className="text-xl font-semibold text-[#eeeef0]">
                    {topic.title}
                  </h3>
                  <p className="mt-3 text-[#b5b2bc] leading-7">
                    {topic.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Formats + Audiences */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
                Formats
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#eeeef0] sm:text-4xl">
                Pick what fits your event.
              </h2>
              <div className="mt-8 space-y-4">
                {speakingContent.formats.map((format) => (
                  <div
                    key={format.title}
                    className="rounded-[1.5rem] border border-white/10 bg-[#232225] p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[#eeeef0]">
                        {format.title}
                      </h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b5b2bc]">
                        {format.detail}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#b5b2bc] leading-6">
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#232225] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
                Audiences
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-[#eeeef0]">
                Who Ajay speaks to.
              </h3>
              <ul className="mt-6 space-y-3 text-[#c9c7cf]">
                {speakingContent.audiences.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b5b2bc]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#b5b2bc]">
                Prefer to talk first?{" "}
                <a
                  href={contactInfo.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#eeeef0] underline-offset-2 hover:underline"
                >
                  Book a 30-min call →
                </a>
                <p className="mt-2">
                  Or reach out:{" "}
                  <CallButton className="font-semibold text-[#eeeef0] underline-offset-2 hover:underline" />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry form */}
        <section
          id="inquire"
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
        >
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
                Inquire
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
                Tell Ajay about your event.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#b5b2bc]">
                Share a few details and Ajay will reply by email within a few
                working days, usually with availability, a fee range, and a
                couple of talk options shaped for your team.
              </p>
              <p className="mt-6 text-sm text-[#9b99a3]">
                Only your organization, contact name, email, and message are
                required. Everything else helps Ajay come back with a sharper
                proposal.
              </p>
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
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Organization
                  </span>
                  <input
                    name="organization"
                    required
                    placeholder="Acme Inc."
                    className={inputClass}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Your name
                  </span>
                  <input
                    name="contactName"
                    required
                    placeholder="Priya Sharma"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Phone{" "}
                    <span className="text-[#7c7a85]">(optional)</span>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 …"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Event type{" "}
                    <span className="text-[#7c7a85]">(optional)</span>
                  </span>
                  <select
                    name="eventType"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Keynote">Keynote</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Fireside chat">Fireside chat</option>
                    <option value="Wellness week">Wellness week</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Preferred date{" "}
                    <span className="text-[#7c7a85]">(optional)</span>
                  </span>
                  <input
                    name="eventDate"
                    type="date"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Audience size{" "}
                    <span className="text-[#7c7a85]">(optional)</span>
                  </span>
                  <input
                    name="audienceSize"
                    placeholder="50 – 100"
                    className={inputClass}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Location{" "}
                    <span className="text-[#7c7a85]">(optional)</span>
                  </span>
                  <input
                    name="location"
                    placeholder="City or 'virtual'"
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="mt-5 block space-y-2">
                <span className="text-sm font-medium text-[#c9c7cf]">
                  Tell Ajay about the event
                </span>
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder="Audience, theme you're hoping to land on, what success looks like…"
                  className={inputClass}
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-full bg-[#eeeef0] px-6 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send inquiry"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
