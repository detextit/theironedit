"use client";

import { useMemo, useState } from "react";
import { coachingPrograms } from "@/lib/content/programs";

type SubmissionState = {
  enrollmentId?: string;
  selectedProgram?: string;
  message?: string;
  error?: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function EnrollmentForm() {
  const [selectedProgram, setSelectedProgram] = useState(coachingPrograms[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [state, setState] = useState<SubmissionState>({});

  const program = useMemo(
    () => coachingPrograms.find((item) => item.id === selectedProgram),
    [selectedProgram]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setState({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      programId: selectedProgram,
      goals: String(formData.get("goals") || ""),
      availability: String(formData.get("availability") || ""),
      paymentIntent:
        formData.get("paymentIntent") === "pay-online"
          ? "pay-online"
          : "coach-review",
      consent: formData.get("consent") === "on",
    };

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setState({ error: data.error || "Enrollment could not be submitted." });
        return;
      }

      setState({
        enrollmentId: data.enrollmentId,
        selectedProgram,
        message:
          data.message ||
          "Enrollment received. Ajay will review your request and send you a secure link to pay and get started.",
      });
    } catch {
      setState({ error: "Enrollment could not be submitted. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePayment() {
    if (!state.enrollmentId) return;

    setIsPaying(true);
    setState((current) => ({ ...current, error: undefined }));

    try {
      const response = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: state.enrollmentId,
          programId: state.selectedProgram,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setState((current) => ({
          ...current,
          error:
            data.error ||
            "Online payment is scaffolded but not configured yet.",
        }));
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setState((current) => ({
          ...current,
          error: "Razorpay checkout could not be loaded.",
        }));
        return;
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "The Iron Edit",
        description: "Enrollment fee",
        order_id: data.orderId,
        prefill: data.prefill,
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyResponse = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentResponse),
          });
          const verifyData = await verifyResponse.json();
          setState((current) => ({
            ...current,
            message: verifyResponse.ok
              ? "Payment verified. Your enrollment is ready for coach review."
              : verifyData.error || "Payment could not be verified.",
            error: verifyResponse.ok ? undefined : verifyData.error,
          }));
        },
      });

      checkout.open();
    } catch {
      setState((current) => ({
        ...current,
        error: "Online payment is not available right now.",
      }));
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#232225] p-5 shadow-xl shadow-black/40 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#b5b2bc]">
            Enrollment
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#eeeef0]">
            Tell us where you are starting.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#b5b2bc]">
            No account is required. Enroll now, and once Ajay reviews your
            request you will be sent a secure link to pay and get started.
          </p>
        </div>

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

        <label className="space-y-2 block">
          <span className="text-sm font-medium text-[#c9c7cf]">Phone</span>
          <input
            name="phone"
            required
            className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
          />
        </label>

        <div className="space-y-3">
          <span className="text-sm font-medium text-[#c9c7cf]">
            Choose a coaching track
          </span>
          <div className="grid gap-3">
            {coachingPrograms.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-3xl border p-4 transition ${
                  selectedProgram === item.id
                    ? "border-[#b5b2bc] bg-[#1a191b]"
                    : "border-white/10 bg-[#232225] hover:border-white/25"
                }`}
              >
                <input
                  type="radio"
                  name="program"
                  value={item.id}
                  checked={selectedProgram === item.id}
                  onChange={() => setSelectedProgram(item.id)}
                  className="sr-only"
                />
                <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#b5b2bc]">
                  {item.eyebrow}
                </span>
                <span className="mt-1 block text-lg font-semibold text-[#eeeef0]">
                  {item.name}
                </span>
                <span className="mt-1 block text-sm text-[#b5b2bc]">
                  {item.duration} · {item.idealFor}
                </span>
              </label>
            ))}
          </div>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-medium text-[#c9c7cf]">
            Goals and current challenges
          </span>
          <textarea
            name="goals"
            required
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
            placeholder="Tell Ajay what you want to change, what you have tried, and what support you need."
          />
        </label>

        <label className="space-y-2 block">
          <span className="text-sm font-medium text-[#c9c7cf]">
            Availability
          </span>
          <textarea
            name="availability"
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none transition focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10"
            placeholder="Preferred days, time zone, travel constraints, or anything Ajay should know."
          />
        </label>

        <div className="rounded-3xl border border-white/10 bg-[#1a191b] p-4">
          <p className="font-medium text-[#eeeef0]">Payment</p>
          <p className="mt-2 text-sm leading-6 text-[#b5b2bc]">
            There is nothing to pay right now. After you submit, Ajay reviews
            your enrollment and sends you a secure payment link to confirm your
            spot and get started.
          </p>
        </div>

        <label className="flex gap-3 text-sm leading-6 text-[#c9c7cf]">
          <input name="consent" type="checkbox" required className="mt-1 accent-[#9a8da8]" />
          I consent to The Iron Edit contacting me about this enrollment and
          understand this is not medical advice.
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#eeeef0] px-6 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit enrollment"}
        </button>
      </form>

      {(state.message || state.error) && (
        <div
          className={`mt-6 rounded-3xl p-4 text-sm leading-6 ${
            state.error
              ? "bg-rose-50 text-rose-800"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {state.message || state.error}
        </div>
      )}

      {state.enrollmentId && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#2b292d] p-4">
          <p className="font-medium text-[#eeeef0]">What happens next</p>
          <p className="mt-2 text-sm leading-6 text-[#b5b2bc]">
            Your enrollment ID is {state.enrollmentId}. Ajay will personally
            review your request and send you a secure link to pay and get
            started. There is nothing to pay right now.
          </p>
        </div>
      )}

      {program && (
        <div className="mt-6 rounded-3xl bg-[#232225] p-4">
          <p className="text-sm font-semibold text-[#eeeef0]">
            Selected: {program.name}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[#b5b2bc]">
            {program.outcomes.map((outcome) => (
              <li key={outcome}>✓ {outcome}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
