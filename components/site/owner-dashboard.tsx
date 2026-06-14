"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { coachingPrograms } from "@/lib/content/programs";
import OwnerIssueDesk from "@/components/site/owner-issue-desk";
import OwnerBlogComposer from "@/components/site/owner-blog-composer";

type Lifecycle = "active" | "expiring" | "expired" | "cancelled" | "pending";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  programId: string;
  programName: string;
  amountInr: number;
  currency: string;
  status: "active" | "cancelled";
  source: "manual" | "razorpay";
  paidAt: string | null;
  planStart: string | null;
  planEnd: string | null;
  notes: string;
  createdAt: string;
  daysRemaining: number | null;
  lifecycle: Lifecycle;
};

type MemberFormState = {
  name: string;
  email: string;
  phone: string;
  programId: string;
  amountInr: string;
  status: "active" | "cancelled";
  paidAt: string;
  planStart: string;
  planEnd: string;
  notes: string;
};

type EnrollmentStatus = "new" | "reviewed" | "converted" | "declined";

type Enrollment = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  programId: string;
  programName: string;
  goals: string;
  availability: string;
  status: EnrollmentStatus;
  convertedMemberId: string | null;
  createdAt: string;
};

type ConvertFormState = {
  amountInr: string;
  paidAt: string;
  planStart: string;
  planEnd: string;
  notes: string;
};

type Subscriber = {
  id: string;
  email: string;
  name: string;
  source: string;
  status: "active" | "unsubscribed";
  createdAt: string;
};

type Campaign = {
  id: string;
  subject: string;
  body: string;
  recipientCount: number;
  failedCount: number;
  sentAt: string;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#2b292d] px-3 py-2 text-sm text-[#eeeef0] placeholder:text-[#7c7a85] outline-none focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10";
const labelClass = "block text-xs font-medium text-[#b5b2bc]";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): MemberFormState {
  return {
    name: "",
    email: "",
    phone: "",
    programId: "",
    amountInr: "",
    status: "active",
    paidAt: todayStr(),
    planStart: todayStr(),
    planEnd: "",
    notes: "",
  };
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function rupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const lifecycleStyles: Record<Lifecycle, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  expiring: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  expired: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  cancelled: "bg-white/5 text-[#9b99a3] border-white/10",
  pending: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

function lifecycleLabel(m: Member) {
  switch (m.lifecycle) {
    case "active":
      return m.daysRemaining !== null ? `Active · ${m.daysRemaining}d left` : "Active";
    case "expiring":
      return `Expiring · ${m.daysRemaining}d left`;
    case "expired":
      return m.daysRemaining !== null
        ? `Expired · ${Math.abs(m.daysRemaining)}d ago`
        : "Expired";
    case "cancelled":
      return "Cancelled";
    case "pending":
      return "No plan dates";
  }
}

const enrollmentStatusStyles: Record<EnrollmentStatus, string> = {
  new: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  reviewed: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  converted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  declined: "bg-white/5 text-[#9b99a3] border-white/10",
};

const enrollmentStatusLabel: Record<EnrollmentStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  converted: "Converted",
  declined: "Declined",
};

function emptyConvertForm(): ConvertFormState {
  return {
    amountInr: "",
    paidAt: todayStr(),
    planStart: todayStr(),
    planEnd: "",
    notes: "",
  };
}

export default function OwnerDashboard() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState("");

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<
    "members" | "enrollments" | "newsletter" | "blog"
  >("members");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const [convertId, setConvertId] = useState<string | null>(null);
  const [convertForm, setConvertForm] = useState<ConvertFormState>(
    emptyConvertForm(),
  );
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState("");

  const [showIssueDesk, setShowIssueDesk] = useState(false);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [nlLoading, setNlLoading] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const authFetch = useCallback(
    (path: string, init: RequestInit = {}) =>
      fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          "x-owner-secret": secret,
          ...(init.headers || {}),
        },
      }),
    [secret],
  );

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch("/api/owner/members");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load members");
      setMembers(data.members ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load members");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const loadEnrollments = useCallback(async () => {
    setEnrollLoading(true);
    setError("");
    try {
      const res = await authFetch("/api/owner/enrollments");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load enrollments");
      setEnrollments(data.enrollments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load enrollments");
    } finally {
      setEnrollLoading(false);
    }
  }, [authFetch]);

  const loadNewsletter = useCallback(async () => {
    setNlLoading(true);
    setError("");
    try {
      const [subRes, campRes] = await Promise.all([
        authFetch("/api/owner/subscribers"),
        authFetch("/api/owner/newsletter/campaigns"),
      ]);
      const subData = await subRes.json().catch(() => ({}));
      const campData = await campRes.json().catch(() => ({}));
      if (!subRes.ok) throw new Error(subData.error || "Could not load subscribers");
      setSubscribers(subData.subscribers ?? []);
      setActiveCount(subData.activeCount ?? 0);
      setCampaigns(campData.campaigns ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load newsletter");
    } finally {
      setNlLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (authed) {
      loadMembers();
      loadEnrollments();
      loadNewsletter();
    }
  }, [authed, loadMembers, loadEnrollments, loadNewsletter]);

  async function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifying(true);
    setAuthError("");
    const passcode = String(
      new FormData(event.currentTarget).get("passcode") || "",
    );
    try {
      const res = await fetch("/api/owner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || "Invalid passcode.");
        return;
      }
      setSecret(passcode);
      setAuthed(true);
    } catch {
      setAuthError("Could not verify passcode. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
    setShowForm(true);
  }

  function openEdit(m: Member) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone,
      programId: m.programId,
      amountInr: String(m.amountInr || ""),
      status: m.status,
      paidAt: m.paidAt ? m.paidAt.slice(0, 10) : "",
      planStart: m.planStart ?? "",
      planEnd: m.planEnd ?? "",
      notes: m.notes,
    });
    setFormError("");
    setShowForm(true);
  }

  async function saveForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const body = {
      ...form,
      amountInr: form.amountInr ? Number(form.amountInr) : 0,
    };
    try {
      const res = await authFetch(
        editingId ? `/api/owner/members/${editingId}` : "/api/owner/members",
        { method: editingId ? "PATCH" : "POST", body: JSON.stringify(body) },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save member");
      setShowForm(false);
      await loadMembers();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save member");
    } finally {
      setSaving(false);
    }
  }

  async function removeMember(m: Member) {
    if (!confirm(`Delete ${m.name}? This cannot be undone.`)) return;
    try {
      const res = await authFetch(`/api/owner/members/${m.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete member");
      }
      await loadMembers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete member");
    }
  }

  async function setEnrollmentStatus(en: Enrollment, status: EnrollmentStatus) {
    try {
      const res = await authFetch(`/api/owner/enrollments/${en.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update enrollment");
      }
      await loadEnrollments();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update enrollment");
    }
  }

  async function removeEnrollment(en: Enrollment) {
    if (!confirm(`Delete enrollment request from ${en.name}?`)) return;
    try {
      const res = await authFetch(`/api/owner/enrollments/${en.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete enrollment");
      }
      await loadEnrollments();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete enrollment");
    }
  }

  function openConvert(en: Enrollment) {
    setConvertId(en.id);
    setConvertForm(emptyConvertForm());
    setConvertError("");
  }

  async function submitConvert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!convertId) return;
    setConverting(true);
    setConvertError("");
    try {
      const res = await authFetch(
        `/api/owner/enrollments/${convertId}/convert`,
        {
          method: "POST",
          body: JSON.stringify({
            ...convertForm,
            amountInr: convertForm.amountInr ? Number(convertForm.amountInr) : 0,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not convert enrollment");
      setConvertId(null);
      await Promise.all([loadEnrollments(), loadMembers()]);
      setTab("members");
    } catch (e) {
      setConvertError(
        e instanceof Error ? e.message : "Could not convert enrollment",
      );
    } finally {
      setConverting(false);
    }
  }

  async function removeSubscriber(s: Subscriber) {
    if (!confirm(`Delete subscriber ${s.email}?`)) return;
    try {
      const res = await authFetch(`/api/owner/subscribers/${s.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete subscriber");
      }
      await loadNewsletter();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete subscriber");
    }
  }

  async function sendNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !confirm(
        `Send this email to ${activeCount} active subscriber${activeCount === 1 ? "" : "s"}?`,
      )
    )
      return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await authFetch("/api/owner/newsletter/send", {
        method: "POST",
        body: JSON.stringify({
          subject: composeSubject,
          body: composeBody,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send newsletter");
      setSendResult({ ok: true, message: data.message || "Sent." });
      setComposeSubject("");
      setComposeBody("");
      await loadNewsletter();
    } catch (e) {
      setSendResult({
        ok: false,
        message: e instanceof Error ? e.message : "Could not send newsletter",
      });
    } finally {
      setSending(false);
    }
  }

  const stats = useMemo(() => {
    const active = members.filter(
      (m) => m.lifecycle === "active" || m.lifecycle === "expiring",
    ).length;
    const expiring = members.filter((m) => m.lifecycle === "expiring").length;
    const expired = members.filter((m) => m.lifecycle === "expired").length;
    const revenue = members
      .filter((m) => m.status !== "cancelled")
      .reduce((sum, m) => sum + (m.amountInr || 0), 0);
    return { active, expiring, expired, revenue, total: members.length };
  }, [members]);

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <h1 className="text-2xl font-semibold">Coach dashboard</h1>
        <p className="mt-2 text-sm text-[#b5b2bc]">
          Enter your owner passcode to manage members and payments.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 space-y-3">
          <input
            type="password"
            name="passcode"
            placeholder="Owner passcode"
            autoComplete="current-password"
            className={inputClass}
            required
          />
          {authError && <p className="text-sm text-rose-300">{authError}</p>}
          <button
            type="submit"
            disabled={verifying}
            className="w-full rounded-xl bg-[#eeeef0] px-4 py-2 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:opacity-60"
          >
            {verifying ? "Verifying…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  const newEnrollmentCount = enrollments.filter(
    (e) => e.status === "new",
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Coach dashboard</h1>
          <p className="mt-1 text-sm text-[#b5b2bc]">
            Manage paid members and incoming enrollment requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tab !== "blog" && (
            <button
              onClick={
                tab === "members"
                  ? loadMembers
                  : tab === "enrollments"
                    ? loadEnrollments
                    : loadNewsletter
              }
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#c9c7cf] transition hover:bg-white/5"
            >
              Refresh
            </button>
          )}
          <button
            onClick={() => setShowIssueDesk(true)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#c9c7cf] transition hover:bg-white/5"
          >
            Report an issue
          </button>
          {tab === "members" && (
            <button
              onClick={openAdd}
              className="rounded-xl bg-[#eeeef0] px-4 py-2 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
            >
              Add member
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-1 rounded-xl border border-white/10 bg-[#1f1e21] p-1 text-sm sm:inline-flex">
        <button
          onClick={() => setTab("members")}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            tab === "members"
              ? "bg-[#eeeef0] text-[#1a191b]"
              : "text-[#c9c7cf] hover:bg-white/5"
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setTab("enrollments")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
            tab === "enrollments"
              ? "bg-[#eeeef0] text-[#1a191b]"
              : "text-[#c9c7cf] hover:bg-white/5"
          }`}
        >
          Enrollment requests
          {newEnrollmentCount > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                tab === "enrollments"
                  ? "bg-[#1a191b] text-[#eeeef0]"
                  : "bg-sky-500/20 text-sky-300"
              }`}
            >
              {newEnrollmentCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("newsletter")}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            tab === "newsletter"
              ? "bg-[#eeeef0] text-[#1a191b]"
              : "text-[#c9c7cf] hover:bg-white/5"
          }`}
        >
          Newsletter
        </button>
        <button
          onClick={() => setTab("blog")}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            tab === "blog"
              ? "bg-[#eeeef0] text-[#1a191b]"
              : "text-[#c9c7cf] hover:bg-white/5"
          }`}
        >
          Blog
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      {tab === "members" && (
      <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active members", value: String(stats.active) },
          { label: "Expiring ≤ 7 days", value: String(stats.expiring) },
          { label: "Expired", value: String(stats.expired) },
          { label: "Recorded revenue", value: rupees(stats.revenue) },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-[#232225] p-5"
          >
            <p className="text-2xl font-semibold text-[#eeeef0]">{card.value}</p>
            <p className="mt-1 text-xs text-[#b5b2bc]">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-[#1f1e21] text-xs uppercase tracking-wide text-[#9b99a3]">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Program</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[#9b99a3]">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[#9b99a3]">
                  No members yet. Add your first paid client.
                </td>
              </tr>
            )}
            {!loading &&
              members.map((m) => (
                <tr key={m.id} className="align-top hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#eeeef0]">{m.name}</div>
                    <div className="text-xs text-[#9b99a3]">{m.email}</div>
                    {m.phone && (
                      <div className="text-xs text-[#9b99a3]">{m.phone}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#c9c7cf]">
                    {m.programName || "—"}
                    {m.source === "razorpay" && (
                      <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#9b99a3]">
                        Razorpay
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#c9c7cf]">
                    {m.amountInr ? rupees(m.amountInr) : "—"}
                  </td>
                  <td className="px-4 py-3 text-[#c9c7cf]">
                    {formatDate(m.paidAt)}
                  </td>
                  <td className="px-4 py-3 text-[#c9c7cf]">
                    {formatDate(m.planStart)}
                    <span className="text-[#7c7a85]"> → </span>
                    {formatDate(m.planEnd)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-1 text-xs ${lifecycleStyles[m.lifecycle]}`}
                    >
                      {lifecycleLabel(m)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#c9c7cf] transition hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeMember(m)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </>
      )}

      {tab === "enrollments" && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-[#1f1e21] text-xs uppercase tracking-wide text-[#9b99a3]">
              <tr>
                <th className="px-4 py-3 font-medium">Request</th>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Goals</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enrollLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#9b99a3]">
                    Loading…
                  </td>
                </tr>
              )}
              {!enrollLoading && enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#9b99a3]">
                    No enrollment requests yet.
                  </td>
                </tr>
              )}
              {!enrollLoading &&
                enrollments.map((en) => (
                  <tr key={en.id} className="align-top hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#eeeef0]">{en.name}</div>
                      <div className="text-xs text-[#9b99a3]">{en.email}</div>
                      {en.phone && (
                        <div className="text-xs text-[#9b99a3]">{en.phone}</div>
                      )}
                      {en.reference && (
                        <div className="text-[10px] text-[#7c7a85]">
                          {en.reference}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#c9c7cf]">
                      {en.programName || "—"}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-[#b5b2bc]">
                      <span className="line-clamp-3">{en.goals || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-[#c9c7cf]">
                      {formatDate(en.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-xs ${enrollmentStatusStyles[en.status]}`}
                      >
                        {enrollmentStatusLabel[en.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        {en.status !== "converted" && (
                          <button
                            onClick={() => openConvert(en)}
                            className="rounded-lg bg-[#eeeef0] px-3 py-1.5 text-xs font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
                          >
                            Convert to member
                          </button>
                        )}
                        {en.status === "new" && (
                          <button
                            onClick={() => setEnrollmentStatus(en, "reviewed")}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#c9c7cf] transition hover:bg-white/5"
                          >
                            Mark reviewed
                          </button>
                        )}
                        {en.status !== "declined" &&
                          en.status !== "converted" && (
                            <button
                              onClick={() => setEnrollmentStatus(en, "declined")}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#c9c7cf] transition hover:bg-white/5"
                            >
                              Decline
                            </button>
                          )}
                        <button
                          onClick={() => removeEnrollment(en)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "newsletter" && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-[#1f1e21] p-6">
            <h2 className="text-lg font-semibold">Compose weekly email</h2>
            <p className="mt-1 text-sm text-[#b5b2bc]">
              Sends to {activeCount} active subscriber
              {activeCount === 1 ? "" : "s"}. Each gets their own copy with an
              unsubscribe link.
            </p>
            <form onSubmit={sendNewsletter} className="mt-5 space-y-4">
              <label className="space-y-1 block">
                <span className={labelClass}>Subject</span>
                <input
                  className={inputClass}
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="This week at The Iron Edit"
                  required
                />
              </label>
              <label className="space-y-1 block">
                <span className={labelClass}>Message</span>
                <textarea
                  className={inputClass}
                  rows={12}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder={
                    "Write your weekly note here.\n\nLeave a blank line between paragraphs."
                  }
                  required
                />
              </label>
              {sendResult && (
                <p
                  className={`text-sm ${
                    sendResult.ok ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {sendResult.message}
                </p>
              )}
              <button
                type="submit"
                disabled={sending || activeCount === 0}
                className="rounded-xl bg-[#eeeef0] px-5 py-2.5 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:opacity-60"
              >
                {sending
                  ? "Sending…"
                  : `Send to ${activeCount} subscriber${activeCount === 1 ? "" : "s"}`}
              </button>
            </form>

            {campaigns.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-sm font-semibold text-[#eeeef0]">
                  Recent sends
                </h3>
                <ul className="mt-3 space-y-2">
                  {campaigns.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="truncate text-[#c9c7cf]">
                        {c.subject}
                      </span>
                      <span className="shrink-0 text-xs text-[#9b99a3]">
                        {formatDate(c.sentAt)} · {c.recipientCount} sent
                        {c.failedCount ? ` · ${c.failedCount} failed` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#232225] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Subscribers</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#b5b2bc]">
                {activeCount} active · {subscribers.length} total
              </span>
            </div>
            <div className="mt-4 max-h-[30rem] overflow-y-auto">
              {nlLoading && (
                <p className="py-8 text-center text-sm text-[#9b99a3]">
                  Loading…
                </p>
              )}
              {!nlLoading && subscribers.length === 0 && (
                <p className="py-8 text-center text-sm text-[#9b99a3]">
                  No subscribers yet.
                </p>
              )}
              {!nlLoading &&
                subscribers.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 border-b border-white/5 py-2.5 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[#eeeef0]">{s.email}</div>
                      {s.name && (
                        <div className="truncate text-xs text-[#9b99a3]">
                          {s.name}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${
                          s.status === "active"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                            : "border-white/10 bg-white/5 text-[#9b99a3]"
                        }`}
                      >
                        {s.status === "active" ? "Active" : "Unsubscribed"}
                      </span>
                      <button
                        onClick={() => removeSubscriber(s)}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {convertId && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={submitConvert}
            className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#1f1e21] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Convert to paid member</h2>
              <button
                type="button"
                onClick={() => setConvertId(null)}
                className="rounded-lg px-2 py-1 text-sm text-[#9b99a3] hover:bg-white/5"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-[#b5b2bc]">
              Record the payment to create a member. The plan end date is
              auto-filled from the program duration when left blank.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className={labelClass}>Amount paid (₹)</span>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={convertForm.amountInr}
                  onChange={(e) =>
                    setConvertForm({ ...convertForm, amountInr: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Paid on</span>
                <input
                  type="date"
                  className={inputClass}
                  value={convertForm.paidAt}
                  onChange={(e) =>
                    setConvertForm({ ...convertForm, paidAt: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Plan start</span>
                <input
                  type="date"
                  className={inputClass}
                  value={convertForm.planStart}
                  onChange={(e) =>
                    setConvertForm({ ...convertForm, planStart: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>
                  Plan end{" "}
                  <span className="text-[#7c7a85]">(auto from program)</span>
                </span>
                <input
                  type="date"
                  className={inputClass}
                  value={convertForm.planEnd}
                  onChange={(e) =>
                    setConvertForm({ ...convertForm, planEnd: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className={labelClass}>Notes</span>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={convertForm.notes}
                  onChange={(e) =>
                    setConvertForm({ ...convertForm, notes: e.target.value })
                  }
                />
              </label>
            </div>

            {convertError && (
              <p className="mt-4 text-sm text-rose-300">{convertError}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConvertId(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#c9c7cf] transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={converting}
                className="rounded-xl bg-[#eeeef0] px-4 py-2 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:opacity-60"
              >
                {converting ? "Converting…" : "Create paid member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveForm}
            className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#1f1e21] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit member" : "Add member"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-2 py-1 text-sm text-[#9b99a3] hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 sm:col-span-2">
                <span className={labelClass}>Name</span>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Email</span>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Phone</span>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Program</span>
                <select
                  className={inputClass}
                  value={form.programId}
                  onChange={(e) =>
                    setForm({ ...form, programId: e.target.value })
                  }
                >
                  <option value="">— None —</option>
                  {coachingPrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.duration})
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Amount paid (₹)</span>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.amountInr}
                  onChange={(e) =>
                    setForm({ ...form, amountInr: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Paid on</span>
                <input
                  type="date"
                  className={inputClass}
                  value={form.paidAt}
                  onChange={(e) => setForm({ ...form, paidAt: e.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Plan start</span>
                <input
                  type="date"
                  className={inputClass}
                  value={form.planStart}
                  onChange={(e) =>
                    setForm({ ...form, planStart: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>
                  Plan end{" "}
                  <span className="text-[#7c7a85]">(auto from program)</span>
                </span>
                <input
                  type="date"
                  className={inputClass}
                  value={form.planEnd}
                  onChange={(e) => setForm({ ...form, planEnd: e.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Status</span>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as "active" | "cancelled",
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className={labelClass}>Notes</span>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
            </div>

            {formError && (
              <p className="mt-4 text-sm text-rose-300">{formError}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#c9c7cf] transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#eeeef0] px-4 py-2 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Add member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === "blog" && (
        <div className="mt-8">
          <OwnerBlogComposer secret={secret} />
        </div>
      )}

      <OwnerIssueDesk
        embedded
        open={showIssueDesk}
        onClose={() => setShowIssueDesk(false)}
        presetSecret={secret}
      />
    </div>
  );
}
