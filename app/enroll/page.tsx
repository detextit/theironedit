import Image from "next/image";
import EnrollmentForm from "@/components/site/enrollment-form";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { contactInfo, trainerImages } from "@/lib/content/site";

export default function EnrollPage() {
  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:px-8 lg:py-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
              Enrollment
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#eeeef0] sm:text-6xl">
              Start with a plan that can survive real life.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#b5b2bc]">
              Share your goals and choose a coaching track. After Ajay reviews
              your enrollment, you will be sent a secure link to pay and get
              started. No login or signup is required.
            </p>

            <div className="mt-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-[#2b292d] shadow-lg shadow-black/40">
                <Image
                  src={trainerImages.transformationAfter.src}
                  alt={trainerImages.transformationAfter.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={trainerImages.transformationAfter.blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain p-2"
                />
              </div>
            </div>
            <div className="mt-6 rounded-[2rem] border border-[#b5b2bc]/50 bg-[#232225] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b5b2bc]">
                Not ready to commit?
              </p>
              <p className="mt-3 text-sm leading-6 text-[#b5b2bc]">
                Prefer to talk it through first? Book a free 30-minute call with
                Ajay. No pressure, just a conversation about where you are and
                where you want to go.
              </p>
              <a
                href={contactInfo.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-[#eeeef0] transition hover:bg-[#eeeef0] hover:text-[#1a191b]"
              >
                Book a free 30-min call →
              </a>
              <p className="mt-3 text-xs text-[#9b99a3]">
                Or reach us directly at {contactInfo.phone}.
              </p>
            </div>
          </div>

          <EnrollmentForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
