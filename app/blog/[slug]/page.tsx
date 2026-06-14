import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/site/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { getPublishedPost } from "@/lib/server/blog-posts";

// DB-backed posts must render on demand. Static posts are still fast
// enough at this site's traffic volume to render dynamically too.
export const dynamic = "force-dynamic";

function renderInline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#eeeef0]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1a191b] text-[#eeeef0]">
      <SiteHeader />
      <main>
        <article>
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-white/10 bg-[#232225] px-4 py-2 text-sm font-medium text-[#c9c7cf] transition hover:border-white/25"
            >
              ← Back to blog
            </Link>
            <div className="mt-8 overflow-hidden rounded-[2.5rem] bg-[#232225] shadow-xl shadow-black/40">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#2b292d]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-10 lg:p-12">
                <div className="flex flex-wrap gap-2 text-sm font-medium text-[#9b99a3]">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#eeeef0] sm:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-5 text-xl leading-8 text-[#b5b2bc]">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="space-y-7 text-lg leading-8 text-[#c9c7cf]">
              {post.body.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={`${block.text}-${index}`}
                      className="pt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#eeeef0]"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "subheading") {
                  return (
                    <h3
                      key={`${block.text}-${index}`}
                      className="pt-2 text-xl font-semibold leading-snug text-[#b5b2bc]"
                    >
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === "callout") {
                  return (
                    <div
                      key={`callout-${index}`}
                      className="whitespace-pre-line rounded-[2rem] border-l-4 border-[#b5b2bc] bg-[#232225] p-6 text-[#eeeef0] shadow-sm"
                    >
                      {renderInline(block.text)}
                    </div>
                  );
                }

                if (block.type === "list") {
                  const ListTag = block.ordered ? "ol" : "ul";
                  return (
                    <ListTag
                      key={`list-${index}`}
                      className={`space-y-2 pl-6 ${
                        block.ordered ? "list-decimal" : "list-disc"
                      } marker:text-[#b5b2bc]`}
                    >
                      {block.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="whitespace-pre-line pl-1"
                        >
                          {renderInline(item)}
                        </li>
                      ))}
                    </ListTag>
                  );
                }

                return (
                  <p
                    key={`paragraph-${index}`}
                    className="whitespace-pre-line"
                  >
                    {renderInline(block.text)}
                  </p>
                );
              })}
            </div>
          </section>
        </article>

        <section className="bg-[#2b292d] py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-[#232225] p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#b5b2bc]">
                Keep reading
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#eeeef0]">
                Join the weekly coaching note.
              </h2>
              <div className="mt-5">
                <NewsletterForm source={`blog:${post.slug}`} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
