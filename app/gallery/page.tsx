import Link from "next/link";
import type { Metadata } from "next";
import GalleryGrid from "@/components/site/gallery-grid";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { contactInfo, galleryImages, proofStats } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "The Transformation Gallery | The Iron Edit",
  description:
    "Photographs from Ajay Pal Singh's tenth-anniversary shoot, a decade after he rebuilt his health from the ground up.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/10 bg-[#232225] px-4 py-2 text-sm font-medium text-[#c9c7cf] transition hover:border-white/25"
          >
            ← Back home
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
              The transformation
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#eeeef0] sm:text-6xl">
              Ten years in the making.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#b5b2bc]">
              These frames are from Ajay&apos;s tenth-anniversary shoot, a decade
              after a college friend told him to stop complaining and start
              changing. From tuberculosis, a bad back, and breathless after 200
              metres, to this. The point is not the photos. It is the proof that
              change can be designed.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {proofStats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-3xl border border-white/10 bg-[#232225] p-5 shadow-sm"
              >
                <p className="text-3xl font-semibold text-[#eeeef0]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-5 text-[#b5b2bc]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <GalleryGrid images={galleryImages} />

          <div className="mt-14 flex flex-col items-start gap-4 rounded-[2.5rem] bg-[#121113] p-8 text-[#eeeef0] sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Your transformation can start this week.
              </h2>
              <p className="mt-2 text-sm text-[#b5b2bc]">
                Begin enrollment, or book a free 30-minute call if you would
                rather talk it through first.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/enroll"
                className="rounded-full bg-[#eeeef0] px-7 py-4 text-center font-semibold text-[#1a191b] shadow-lg shadow-black/30 transition hover:bg-[#d7d5dd]"
              >
                Start enrollment
              </Link>
              <a
                href={contactInfo.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/50 px-7 py-4 text-center font-semibold text-white transition hover:bg-[#ffffff]/10"
              >
                Book a free call
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
