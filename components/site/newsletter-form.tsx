"use client";

import { useState } from "react";

type Status = {
  success?: boolean;
  message?: string;
};

export default function NewsletterForm({ source = "website" }: { source?: string }) {
  const [status, setStatus] = useState<Status>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({});

    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      source,
    };

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({
          success: false,
          message: data.error || "Could not subscribe right now.",
        });
        return;
      }

      setStatus({
        success: true,
        message: "You're on the list. Watch your inbox for weekly notes.",
      });
      form.reset();
    } catch {
      setStatus({
        success: false,
        message: "Could not subscribe right now. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[0.9fr_1.2fr_auto]">
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="min-h-12 rounded-full border border-white/10 bg-[#2b292d] px-5 text-sm text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email for weekly notes"
          className="min-h-12 rounded-full border border-white/10 bg-[#2b292d] px-5 text-sm text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 rounded-full bg-[#eeeef0] px-6 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Joining..." : "Join"}
        </button>
      </div>
      <p className="text-xs leading-5 text-[#9b99a3]">
        Weekly coaching notes only. No spam. You can ask to be removed anytime.
      </p>
      {status.message && (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            status.success
              ? "bg-emerald-50 text-emerald-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
