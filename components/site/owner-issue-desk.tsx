"use client";

import { useState } from "react";

type SubmissionStatus = {
  success?: boolean;
  message?: string;
  issueUrl?: string;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#2b292d] px-4 py-3 text-[#eeeef0] placeholder:text-[#7c7a85] outline-none focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10";

export default function OwnerIssueDesk({
  visible = false,
  embedded = false,
  open = false,
  onClose,
  presetSecret,
}: {
  visible?: boolean;
  embedded?: boolean;
  open?: boolean;
  onClose?: () => void;
  presetSecret?: string;
}) {
  const [isOpen, setIsOpen] = useState(visible);
  const [authedState, setAuthed] = useState(false);
  const [secretState, setSecret] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>({});

  // In embedded (dashboard) mode the caller is already authenticated and
  // controls visibility; otherwise this is the standalone homepage desk.
  const authed = embedded ? true : authedState;
  const secret = embedded ? presetSecret ?? "" : secretState;
  const panelOpen = embedded ? open : isOpen;

  function closePanel() {
    if (embedded) onClose?.();
    else setIsOpen(false);
  }

  if (!embedded && !visible) return null;

  async function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifying(true);
    setAuthError("");
    const passcode = String(
      new FormData(event.currentTarget).get("passcode") || "",
    );

    try {
      const response = await fetch("/api/owner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
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

  function lock() {
    setAuthed(false);
    setSecret("");
    setStatus({});
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("ownerSecret", secret);

    try {
      const response = await fetch("/api/owner/issues", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) lock();
        setStatus({
          success: false,
          message: data.error || "Owner request could not be submitted.",
        });
        return;
      }

      setStatus({
        success: true,
        message: data.screenshotCount
          ? `Issue created with ${data.screenshotCount} screenshot(s) attached.`
          : "Issue created.",
        issueUrl: data.issueUrl,
      });
      form.reset();
    } catch {
      setStatus({
        success: false,
        message: "Owner request could not be submitted. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {!embedded && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-50 rounded-full bg-[#eeeef0] px-5 py-3 text-sm font-semibold text-[#1a191b] shadow-xl"
        >
          Owner issue desk
        </button>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1a191b]">
          <div className="mx-auto min-h-full w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b5b2bc]">
                  {embedded ? "Coach tools" : "Hidden owner tools"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#eeeef0]">
                  {authed ? "File a website issue" : "Owner sign in"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#b5b2bc]">
                  {authed
                    ? "Each request opens a GitHub Issue on the repo. Screenshots are committed to the issue-assets branch and embedded in the issue. The daily agent picks these up."
                    : "Enter the owner passcode to unlock the issue desk."}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-full bg-[#232225] px-3 py-2 text-sm text-[#b5b2bc]"
              >
                Close
              </button>
            </div>

            {!authed ? (
              <form onSubmit={handleUnlock} className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Owner passcode
                  </span>
                  <input
                    name="passcode"
                    type="password"
                    autoFocus
                    required
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full rounded-full bg-[#eeeef0] px-6 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {verifying ? "Verifying..." : "Unlock issue desk"}
                </button>
                {authError && (
                  <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-800">
                    {authError}
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {!embedded && (
                  <div className="flex items-center justify-between rounded-2xl bg-[#323035] px-4 py-2 text-xs text-[#eeeef0]">
                    <span>Signed in as owner</span>
                    <button
                      type="button"
                      onClick={lock}
                      className="font-semibold underline"
                    >
                      Lock
                    </button>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#c9c7cf]">
                      Request type
                    </span>
                    <select name="requestType" className={inputClass}>
                      <option value="website-issue">Website issue</option>
                      <option value="content-update">Content update</option>
                      <option value="blog-post">Blog post request</option>
                      <option value="enrollment-pricing">
                        Enrollment/pricing
                      </option>
                      <option value="newsletter">Newsletter request</option>
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#c9c7cf]">
                      Priority
                    </span>
                    <select name="priority" className={inputClass}>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">Title</span>
                  <input name="title" required className={inputClass} />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Page or URL
                  </span>
                  <input
                    name="pageUrl"
                    placeholder="/blog or the page that needs work"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Details
                  </span>
                  <textarea
                    name="details"
                    required
                    rows={6}
                    className={inputClass}
                    placeholder="Describe the change, expected behavior, draft blog content, or context."
                  />
                </label>

                <div className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#c9c7cf]">
                      Blog title, if relevant
                    </span>
                    <input name="blogTitle" className={inputClass} />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#c9c7cf]">
                      Blog excerpt, if relevant
                    </span>
                    <textarea
                      name="blogExcerpt"
                      rows={5}
                      className={inputClass}
                      placeholder="A short summary or the draft excerpt for the blog post."
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[#c9c7cf]">
                    Screenshots (up to 5, committed to GitHub)
                  </span>
                  <input
                    name="screenshots"
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full rounded-2xl border border-dashed border-white/15 bg-[#2b292d] px-4 py-4 text-sm text-[#b5b2bc]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#eeeef0] px-6 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating issue..." : "Create GitHub issue"}
                </button>
              </form>
            )}

            {status.message && (
              <div
                className={`mt-5 rounded-3xl p-4 text-sm ${
                  status.success
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-rose-50 text-rose-800"
                }`}
              >
                <p>{status.message}</p>
                {status.issueUrl && (
                  <a
                    href={status.issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block underline"
                  >
                    Open GitHub Issue
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
