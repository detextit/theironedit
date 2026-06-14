"use client";

import { useState } from "react";
import Link from "next/link";

export default function UnsubscribeForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const missing = !email || !token;

  async function handleUnsubscribe() {
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not unsubscribe.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Could not unsubscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f1e21] p-8 text-center">
      <h1 className="text-2xl font-semibold">Unsubscribe</h1>

      {status === "done" ? (
        <>
          <p className="mt-4 text-sm leading-6 text-[#b5b2bc]">
            You have been unsubscribed{email ? ` (${email})` : ""}. You will no
            longer receive weekly emails from The Iron Edit.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#eeeef0] px-5 py-2.5 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
          >
            Back to the site
          </Link>
        </>
      ) : missing ? (
        <p className="mt-4 text-sm leading-6 text-[#b5b2bc]">
          This unsubscribe link is incomplete. Please use the link from your
          email.
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-[#b5b2bc]">
            Stop receiving weekly emails from The Iron Edit at{" "}
            <span className="text-[#eeeef0]">{email}</span>?
          </p>
          {message && (
            <p className="mt-4 text-sm text-rose-300">{message}</p>
          )}
          <button
            onClick={handleUnsubscribe}
            disabled={submitting}
            className="mt-6 inline-flex rounded-xl bg-[#eeeef0] px-5 py-2.5 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:opacity-60"
          >
            {submitting ? "Unsubscribing…" : "Confirm unsubscribe"}
          </button>
        </>
      )}
    </div>
  );
}
