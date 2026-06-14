import Image from "next/image";
import Link from "next/link";
import { Dumbbell, HeartHandshake, Salad } from "lucide-react";
import BlogPreview from "@/components/blog-preview";
import NewsletterForm from "@/components/site/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { coachingPrograms } from "@/lib/content/programs";
import {
  contactInfo,
  founderNote,
  methodPillars,
  proofStats,
  specialties,
  trainerImages,
} from "@/lib/content/site";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-[#121113]">
          <Image
            src={trainerImages.hero.src}
            alt={trainerImages.hero.alt}
            fill
            priority
            placeholder="blur"
            blurDataURL={trainerImages.hero.blurDataURL}
            sizes="100vw"
            className="object-cover object-[70%_top]"
          />
          <div className="absolute inset-0 bg-[#121113]/55 lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#121113]/92 via-[#121113]/55 to-transparent lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121113]/80 via-transparent to-transparent" />

          <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[760px] lg:px-8">
            <div className="lg:max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.55em] text-[#b5b2bc]">
                Fitness coaching, edited for real life
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Strength that fits your life.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#c9c7cf]">
                Personalized coaching designed around your schedule, your goals,
                and the realities of work, travel, family, and everything in
                between.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/enroll"
                  className="rounded-full bg-[#eeeef0] px-7 py-4 text-center font-semibold text-[#1a191b] shadow-lg shadow-black/30 transition hover:bg-[#d7d5dd]"
                >
                  Start enrollment
                </Link>
                <Link
                  href="/gallery"
                  className="rounded-full border border-white/60 px-7 py-4 text-center font-semibold text-white backdrop-blur transition hover:bg-[#ffffff]/10"
                >
                  See the transformation
                </Link>
              </div>
              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {proofStats.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-2xl border border-white/15 bg-[#ffffff]/10 p-4 backdrop-blur-md"
                  >
                    <p className="text-2xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[#c9c7cf]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                The method
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
                Less punishment. More precision.
              </h2>
            </div>
            <p className="text-lg leading-8 text-[#b5b2bc]">
              Ajay blends practical nutrition, age-aware strength training, and
              human accountability into a plan that can survive busy days,
              travel, family, and the normal friction of life.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {methodPillars.map((pillar, index) => {
              const Icon = [Salad, Dumbbell, HeartHandshake][index] ?? Salad;
              return (
              <article
                key={pillar.title}
                className="group rounded-[2rem] border border-white/10 bg-[#232225] p-7 transition duration-200 hover:border-white/20 hover:bg-[#28272b]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#2b292d] text-[#eeeef0]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-xl font-semibold text-[#eeeef0]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#b5b2bc]">
                  {pillar.description}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-[#c9c7cf]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9a8da8]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10">
                <Image
                  src={trainerImages.founder.src}
                  alt={trainerImages.founder.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={trainerImages.founder.blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                {founderNote.eyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
                {founderNote.heading}
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-8 text-[#b5b2bc]">
                {founderNote.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-2xl italic tracking-tight text-[#eeeef0]">
                  {founderNote.signature}
                </p>
                <p className="mt-1 text-sm text-[#9b99a3]">{founderNote.role}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="bg-[#121113] py-16 text-[#eeeef0]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                Proof with care
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Your transformation is personal before it is public.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#b5b2bc]">
                Ajay&apos;s own journey through poor health, discipline, and
                rebuilding is part of the reason this coaching feels grounded.
                The goal is not shame. It is evidence that change can be designed.
              </p>
              <Link
                href="/gallery"
                className="mt-8 inline-flex rounded-full bg-[#eeeef0] px-7 py-4 font-semibold text-[#1a191b] shadow-lg shadow-black/30 transition hover:bg-[#d7d5dd]"
              >
                See the full gallery
              </Link>
            </div>

            <figure>
              <div className="relative aspect-[1758/894] overflow-hidden rounded-[1.75rem]">
                <Image
                  src={trainerImages.transformationAfter.src}
                  alt={trainerImages.transformationAfter.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={trainerImages.transformationAfter.blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                />
              </div>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-[#232225] p-8 shadow-sm sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                  {specialties.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#eeeef0] sm:text-4xl">
                  {specialties.title}
                </h2>
                <p className="mt-4 leading-7 text-[#b5b2bc]">
                  {specialties.description}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {specialties.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1a191b] px-4 py-3"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b5b2bc]"
                    />
                    <span className="text-sm text-[#c9c7cf]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                Programs
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
                Choose the level of support you need next.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#b5b2bc]">
                Enrollment is simple: submit your details, get reviewed, and pay
                online through Razorpay once keys and fee amount are configured.
              </p>
              <Link
                href="/enroll"
                className="mt-8 inline-flex rounded-full bg-[#eeeef0] px-7 py-4 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
              >
                View enrollment form
              </Link>
            </div>
            <div className="grid gap-4">
              {coachingPrograms.map((program) => (
                <article
                  key={program.id}
                  className="rounded-[2rem] border border-white/10 bg-[#232225] p-6 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b5b2bc]">
                    {program.eyebrow}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <h3 className="text-2xl font-semibold text-[#eeeef0]">
                      {program.name}
                    </h3>
                    <p className="text-sm text-[#9b99a3]">{program.duration}</p>
                  </div>
                  <p className="mt-3 text-[#b5b2bc]">{program.description}</p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7c7a85]">
                        For people who
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-[#b5b2bc]">
                        {program.forPeopleWho.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span
                              aria-hidden
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b5b2bc]"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b5b2bc]">
                        You'll leave with
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-[#c9c7cf]">
                        {program.outcomes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span
                              aria-hidden
                              className="font-semibold text-[#b5b2bc]"
                            >
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <BlogPreview />

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#232225] p-8 shadow-xl shadow-black/40 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                  Speaking & workshops
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#eeeef0] sm:text-4xl">
                  Bring Ajay to speak to your team.
                </h2>
                <p className="mt-4 max-w-2xl text-[#b5b2bc] leading-7">
                  Keynotes, half-day workshops, and fireside chats on
                  resilience, discipline, and workplace wellness — for offices,
                  founders, schools, and community groups.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/speaking"
                  className="inline-flex rounded-full bg-[#eeeef0] px-6 py-3 font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
                >
                  See speaking topics
                </Link>
                <Link
                  href="/speaking#inquire"
                  className="inline-flex rounded-full border border-white/25 px-6 py-3 font-semibold text-[#eeeef0] transition hover:bg-[#eeeef0] hover:text-[#1a191b]"
                >
                  Request a date
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2.5rem] bg-[#232225] shadow-xl shadow-black/40 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[320px]">
              <Image
                src={trainerImages.gym.src}
                alt={trainerImages.gym.alt}
                fill
                placeholder="blur"
                blurDataURL={trainerImages.gym.blurDataURL}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                Weekly emails
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#eeeef0] sm:text-4xl">
                Get one thoughtful coaching note each week.
              </h2>
              <p className="mt-4 text-[#b5b2bc] leading-7">
                Join the mailing list for simple training, nutrition, and
                mindset ideas you can actually use. Subscriber persistence is
                scaffolded through owner email notifications for now.
              </p>
              <div className="mt-6">
                <NewsletterForm source="homepage" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
