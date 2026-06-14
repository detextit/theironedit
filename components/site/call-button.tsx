"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { contactInfo } from "@/lib/content/site";

function decode(value: string) {
  if (typeof window === "undefined") return "";
  try {
    return window.atob(value);
  } catch {
    return "";
  }
}

/**
 * Click-to-call control. The phone number is base64-encoded in content and only
 * decoded in the browser after the user clicks, so the raw number / tel: link
 * is never present in the server-rendered HTML for scrapers to harvest.
 */
export default function CallButton({
  className,
  label = "Call the coach",
}: {
  className?: string;
  label?: string;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);

  function handleClick() {
    const number = decode(contactInfo.phoneEncoded);
    const display = decode(contactInfo.phoneDisplayEncoded) || number;
    if (!number) return;
    setRevealed(display);
    // Initiate the call on devices that support tel: (mobile).
    window.location.href = `tel:${number}`;
  }

  if (revealed) {
    const number = decode(contactInfo.phoneEncoded);
    return (
      <a
        href={`tel:${number}`}
        className={`inline-flex items-center gap-2 align-middle ${className ?? ""}`}
      >
        <Phone className="h-4 w-4" aria-hidden />
        {revealed}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 align-middle ${className ?? ""}`}
    >
      <Phone className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

