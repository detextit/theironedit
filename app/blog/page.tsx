import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/site/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { blogPosts } from "@/lib/content/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b5b2bc]">
            Articles
          </p>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-5xl font-semibold tracking-[-0.05em] text-[#eeeef0] sm:text-6xl">
                The Iron Edit Blog
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b5b2bc]">
                Fitness, food, mindset, and practical structure for people who
                want progress without noise.
              </p>
            </div>
            <Link
              href="/enroll"
              className="rounded-full bg-[#eeeef0] px-6 py-4 text-center font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
            >
              Enroll with Ajay
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[2rem] bg-[#232225] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-[#9b99a3]">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-[#eeeef0]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#b5b2bc]">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[#2b292d] py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-[#232225] p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                Weekly notes
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#eeeef0]">
                Get the next article in your inbox.
              </h2>
              <div className="mt-5">
                <NewsletterForm source="blog" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
