import Link from "next/link";
import { contactInfo, siteLinks } from "@/lib/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1a191b]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="group text-center lg:text-left">
          <p className="text-xl font-bold uppercase tracking-[0.18em] text-[#eeeef0] transition group-hover:text-[#eeeef0] sm:text-2xl">
            The Iron Edit
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.3em] text-[#b5b2bc]">
            Coaching by Ajay Pal Singh
          </p>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[#c9c7cf]">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-[#232225] hover:text-[#b5b2bc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5b2bc]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/enroll"
            className="rounded-full bg-[#eeeef0] px-4 py-2 text-[#1a191b] shadow-sm transition hover:bg-[#d7d5dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5b2bc]"
          >
            Start enrollment
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#121113] text-[#eeeef0]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
            The Iron Edit
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#b5b2bc]">
            Practical coaching for people who want strength, energy, and a body
            they trust again. Designed with discipline, warmth, and real-life
            sustainability.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm text-[#b5b2bc]">
            <a
              href={contactInfo.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Book a free 30-min call →
            </a>
            <a href={contactInfo.phoneHref} className="hover:text-white">
              {contactInfo.phone}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm md:items-end">
          <Link href="/enroll" className="hover:text-white">
            Enroll
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <a
            href="https://www.instagram.com/ajayraksh/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
