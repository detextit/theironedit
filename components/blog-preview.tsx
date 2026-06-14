import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/content/blog";

export default function BlogPreview() {
  return (
    <section className="bg-[#2b292d] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
              The blog
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
              Read before you restart.
            </h2>
          </div>
          <Link
            href="/blog"
            className="rounded-full border border-[#eeeef0] px-5 py-3 text-center text-sm font-semibold text-[#eeeef0] transition hover:bg-[#232225]"
          >
            View all articles
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="group overflow-hidden rounded-[2rem] bg-[#232225] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 text-xs font-medium text-[#9b99a3]">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-[#eeeef0]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#b5b2bc]">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
