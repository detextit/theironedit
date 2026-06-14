"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

// Mirrors lib/content/blog.ts BlogBlock. Duplicated here to keep this
// client component free of server-only imports; the API validates the
// payload with the same shape via blogPostCreateSchema.
type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "callout"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean };

type DbBlogPostMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  status: string;
  imageMimeType: string;
  createdAt: string;
  updatedAt: string;
};

type BlockType = BlogBlock["type"];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#2b292d] px-3 py-2 text-sm text-[#eeeef0] placeholder:text-[#7c7a85] outline-none focus:border-[#b5b2bc] focus:ring-4 focus:ring-white/10";
const labelClass = "block text-xs font-medium text-[#b5b2bc]";

function makeBlock(type: BlockType): BlogBlock {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "heading":
      return { type: "heading", text: "" };
    case "subheading":
      return { type: "subheading", text: "" };
    case "callout":
      return { type: "callout", text: "" };
    case "list":
      return { type: "list", items: [""], ordered: false };
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}

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

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  subheading: "Subheading",
  callout: "Callout",
  list: "List",
};

export default function OwnerBlogComposer({ secret }: { secret: string }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [blocks, setBlocks] = useState<BlogBlock[]>([
    { type: "paragraph", text: "" },
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [posts, setPosts] = useState<DbBlogPostMeta[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [listError, setListError] = useState("");

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState("");
  const [confirmingPublish, setConfirmingPublish] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const authFetch = useCallback(
    (path: string, init: RequestInit = {}) =>
      fetch(path, {
        ...init,
        headers: {
          "x-owner-secret": secret,
          ...(init.headers || {}),
        },
      }),
    [secret],
  );

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    setListError("");
    try {
      const res = await authFetch("/api/owner/blog-posts");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load blog posts");
      setPosts(data.posts ?? []);
    } catch (error) {
      setListError(
        error instanceof Error ? error.message : "Could not load blog posts",
      );
    } finally {
      setLoadingPosts(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Keep slug in sync with title until the owner edits the slug explicitly.
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  // Revoke object URLs when the cover image changes so we don't leak blobs.
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const canPublish = useMemo(() => {
    if (publishing) return false;
    if (!title.trim() || !slug.trim()) return false;
    if (!imageFile) return false;
    if (blocks.length === 0) return false;
    // Every block must have non-empty content.
    return blocks.every((block) => {
      if (block.type === "list") {
        return block.items.length > 0 && block.items.every((i) => i.trim());
      }
      return block.text.trim().length > 0;
    });
  }, [publishing, title, slug, imageFile, blocks]);

  function resetForm() {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setExcerpt("");
    setCategory("");
    setReadTime("");
    setBlocks([{ type: "paragraph", text: "" }]);
    setImageFile(null);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
  }

  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, makeBlock(type)]);
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, delta: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateTextBlock(index: number, text: string) {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== index) return block;
        if (block.type === "list") return block;
        return { ...block, text };
      }),
    );
  }

  function updateListOrdered(index: number, ordered: boolean) {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index && block.type === "list" ? { ...block, ordered } : block,
      ),
    );
  }

  function updateListItem(index: number, itemIndex: number, text: string) {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== index || block.type !== "list") return block;
        const items = block.items.map((item, j) =>
          j === itemIndex ? text : item,
        );
        return { ...block, items };
      }),
    );
  }

  function addListItem(index: number) {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index && block.type === "list"
          ? { ...block, items: [...block.items, ""] }
          : block,
      ),
    );
  }

  function removeListItem(index: number, itemIndex: number) {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== index || block.type !== "list") return block;
        if (block.items.length === 1) return block;
        return {
          ...block,
          items: block.items.filter((_, j) => j !== itemIndex),
        };
      }),
    );
  }

  async function handlePublish() {
    if (!canPublish || !imageFile) return;
    setPublishing(true);
    setPublishError("");
    setPublishSuccess("");
    setConfirmingPublish(false);

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      category: category.trim(),
      readTime: readTime.trim(),
      body: blocks,
    };

    const form = new FormData();
    form.append("payload", JSON.stringify(payload));
    form.append("image", imageFile);
    form.append("ownerSecret", secret);

    try {
      const res = await fetch("/api/owner/blog-posts", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not publish blog post");
      }
      setPublishSuccess(`Published "${data.post?.title ?? payload.title}".`);
      resetForm();
      loadPosts();
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "Could not publish blog post",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(post: DbBlogPostMeta) {
    if (
      !window.confirm(
        `Unpublish "${post.title}"? It will be removed from /blog immediately.`,
      )
    ) {
      return;
    }
    setDeletingId(post.id);
    try {
      const res = await authFetch(`/api/owner/blog-posts/${post.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete blog post");
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (error) {
      setListError(
        error instanceof Error ? error.message : "Could not delete blog post",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Published posts</h2>
            <p className="mt-1 text-sm text-[#b5b2bc]">
              Posts the owner has added via this composer. Curated posts in the
              codebase are always live and aren&apos;t listed here.
            </p>
          </div>
          <button
            type="button"
            onClick={loadPosts}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-[#c9c7cf] transition hover:bg-white/5"
          >
            Refresh
          </button>
        </div>

        {listError && (
          <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {listError}
          </p>
        )}

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          {loadingPosts ? (
            <div className="px-4 py-6 text-sm text-[#b5b2bc]">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[#b5b2bc]">
              No owner-published posts yet.
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#1f1e21] text-xs uppercase tracking-wider text-[#b5b2bc]">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-t border-white/5 text-[#eeeef0]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{post.title}</div>
                      {post.excerpt && (
                        <div className="mt-1 line-clamp-1 text-xs text-[#b5b2bc]">
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#b5b2bc]">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        /blog/{post.slug}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#b5b2bc]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        disabled={deletingId === post.id}
                        className="rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === post.id ? "Deleting…" : "Unpublish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Compose a new post</h2>
            <p className="mt-1 text-sm text-[#b5b2bc]">
              Fill the metadata, upload a cover image, and add body components.
              The preview on the right matches the live /blog page exactly.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The story behind this post"
                className={`mt-1 ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="auto-from-title"
                className={`mt-1 ${inputClass}`}
              />
              <p className="mt-1 text-xs text-[#7c7a85]">
                Becomes /blog/{slug || "..."}. Lowercase letters, numbers and
                hyphens.
              </p>
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="One or two sentences shown in cards and at the top of the post."
                className={`mt-1 ${inputClass}`}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Training"
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className={labelClass}>Read time</label>
                <input
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min read"
                  className={`mt-1 ${inputClass}`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Cover image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                onChange={handleImageChange}
                className="mt-1 w-full rounded-xl border border-dashed border-white/15 bg-[#2b292d] px-3 py-3 text-sm text-[#b5b2bc] file:mr-3 file:rounded-lg file:border-0 file:bg-[#eeeef0] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#1a191b]"
              />
              <p className="mt-1 text-xs text-[#7c7a85]">
                JPEG, PNG, WebP, AVIF, or GIF. Max 4 MB.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#b5b2bc]">
                Body components
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                ["paragraph", "heading", "subheading", "callout", "list"] as const
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="rounded-lg border border-white/10 bg-[#1f1e21] px-3 py-1.5 text-xs font-medium text-[#eeeef0] transition hover:bg-white/5"
                >
                  + {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {blocks.map((block, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#1f1e21] p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#b5b2bc]">
                      {BLOCK_LABELS[block.type]}
                      {block.type === "list" && (
                        <span className="ml-2 normal-case text-[#7c7a85]">
                          ({block.ordered ? "ordered" : "unordered"})
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className="rounded-md border border-white/10 px-2 py-1 text-xs text-[#c9c7cf] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === blocks.length - 1}
                        className="rounded-md border border-white/10 px-2 py-1 text-xs text-[#c9c7cf] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="rounded-md border border-rose-500/30 px-2 py-1 text-xs text-rose-300 transition hover:bg-rose-500/10"
                        aria-label="Remove block"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {block.type === "list" ? (
                    <div className="mt-3 space-y-2">
                      <label className="flex items-center gap-2 text-xs text-[#b5b2bc]">
                        <input
                          type="checkbox"
                          checked={!!block.ordered}
                          onChange={(e) =>
                            updateListOrdered(index, e.target.checked)
                          }
                          className="h-3 w-3 accent-[#eeeef0]"
                        />
                        Numbered list
                      </label>
                      {block.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2">
                          <span className="mt-2 text-xs text-[#7c7a85]">
                            {block.ordered ? `${itemIndex + 1}.` : "•"}
                          </span>
                          <input
                            value={item}
                            onChange={(e) =>
                              updateListItem(index, itemIndex, e.target.value)
                            }
                            placeholder="List item"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(index, itemIndex)}
                            disabled={block.items.length === 1}
                            className="mt-1 rounded-md border border-white/10 px-2 py-1 text-xs text-[#c9c7cf] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addListItem(index)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#c9c7cf] transition hover:bg-white/5"
                      >
                        + Add item
                      </button>
                    </div>
                  ) : (
                    <textarea
                      value={block.text}
                      onChange={(e) => updateTextBlock(index, e.target.value)}
                      rows={
                        block.type === "paragraph" || block.type === "callout"
                          ? 4
                          : 2
                      }
                      placeholder={
                        block.type === "callout"
                          ? "Pull-quote or emphasized note. **Bold** with asterisks."
                          : block.type === "heading"
                            ? "Section heading"
                            : block.type === "subheading"
                              ? "Smaller heading"
                              : "Paragraph text. **Bold** with double asterisks."
                      }
                      className={`mt-3 ${inputClass}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {publishError && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {publishError}
            </p>
          )}
          {publishSuccess && (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {publishSuccess}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setConfirmingPublish(true)}
              disabled={!canPublish}
              className="rounded-xl bg-[#eeeef0] px-5 py-3 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={publishing}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-[#c9c7cf] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#b5b2bc]">
            Live preview
          </div>
          <BlogPreviewPane
            title={title}
            excerpt={excerpt}
            category={category}
            readTime={readTime}
            imagePreview={imagePreview}
            blocks={blocks}
          />
        </div>
      </section>

      {confirmingPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f1e21] p-6 text-[#eeeef0]">
            <h3 className="text-lg font-semibold">Publish this post?</h3>
            <p className="mt-2 text-sm text-[#b5b2bc]">
              It will appear at <code>/blog/{slug || "..."}</code> and at the
              top of the /blog listing immediately. You can unpublish it from
              the list above.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingPublish(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#c9c7cf] transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="rounded-xl bg-[#eeeef0] px-4 py-2 text-sm font-semibold text-[#1a191b] transition hover:bg-[#d7d5dd]"
              >
                Yes, publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mirrors app/blog/[slug]/page.tsx: cover image on top, then meta + title +
// excerpt, then body blocks. Keep the JSX in sync with that page.
function BlogPreviewPane({
  title,
  excerpt,
  category,
  readTime,
  imagePreview,
  blocks,
}: {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imagePreview: string | null;
  blocks: BlogBlock[];
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a191b] text-[#eeeef0]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#2b292d]">
        {imagePreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob URL
          <img
            src={imagePreview}
            alt={title || "Cover image preview"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[#7c7a85]">
            Cover image preview
          </div>
        )}
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-[#9b99a3]">
          <span>{category || "Category"}</span>
          <span>·</span>
          <span>{readTime || "Read time"}</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#eeeef0]">
          {title || "Untitled post"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[#b5b2bc]">
          {excerpt || "Add an excerpt to summarise the post."}
        </p>
      </div>
      <div className="border-t border-white/5 px-5 pb-7 pt-5 sm:px-7">
        <div className="space-y-5 text-base leading-7 text-[#c9c7cf]">
          {blocks.length === 0 && (
            <p className="text-sm text-[#7c7a85]">
              Add body components on the left to see them rendered here.
            </p>
          )}
          {blocks.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={index}
                  className="pt-2 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#eeeef0]"
                >
                  {block.text || "Heading"}
                </h2>
              );
            }
            if (block.type === "subheading") {
              return (
                <h3
                  key={index}
                  className="pt-1 text-lg font-semibold leading-snug text-[#b5b2bc]"
                >
                  {block.text || "Subheading"}
                </h3>
              );
            }
            if (block.type === "callout") {
              return (
                <div
                  key={index}
                  className="rounded-[1.5rem] border-l-4 border-[#b5b2bc] bg-[#232225] p-5 text-[#eeeef0]"
                >
                  {block.text
                    ? renderInline(block.text)
                    : "Callout text appears here."}
                </div>
              );
            }
            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag
                  key={index}
                  className={`space-y-1 pl-5 ${
                    block.ordered ? "list-decimal" : "list-disc"
                  } marker:text-[#b5b2bc]`}
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="pl-1">
                      {item ? renderInline(item) : "List item"}
                    </li>
                  ))}
                </ListTag>
              );
            }
            return (
              <p key={index}>
                {block.text ? renderInline(block.text) : "Paragraph text."}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
