import { desc, eq } from "drizzle-orm";
import { getDb, hasDatabaseConfig } from "@/lib/server/db/client";
import {
  blogPostsTable,
  type BlogPostRow,
  type NewBlogPostRow,
} from "@/lib/server/db/schema";
import {
  type BlogBlock,
  type BlogPost,
  blogPosts as staticBlogPosts,
} from "@/lib/content/blog";
import type { BlogPostCreateInput } from "@/lib/validation";

// Map a DB row to the same BlogPost shape the static array exports, so the
// public /blog renderers don't have to care about the source.
function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    readTime: row.readTime,
    // Public cover image is served by the byte-streaming route below.
    imageUrl: `/api/blog-images/${encodeURIComponent(row.slug)}`,
    body: (row.body as BlogBlock[]) ?? [],
  };
}

export type DbBlogPostMeta = {
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

function rowToMeta(row: BlogPostRow): DbBlogPostMeta {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    readTime: row.readTime,
    status: row.status,
    imageMimeType: row.imageMimeType,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function fetchPublishedRows(): Promise<BlogPostRow[]> {
  if (!hasDatabaseConfig()) return [];
  try {
    const db = getDb();
    return await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.status, "published"))
      .orderBy(desc(blogPostsTable.createdAt));
  } catch (error) {
    console.error("[blog-posts] failed to load published rows", error);
    return [];
  }
}

// Returns static posts first (curated order) followed by DB-backed posts
// in descending publish order, so newest owner-published posts surface at
// the top of /blog listings.
export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  const rows = await fetchPublishedRows();
  const dbPosts = rows.map(rowToBlogPost);
  // De-dupe: static slugs always win if there's a collision.
  const staticSlugs = new Set(staticBlogPosts.map((post) => post.slug));
  const filteredDb = dbPosts.filter((post) => !staticSlugs.has(post.slug));
  return [...filteredDb, ...staticBlogPosts];
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const staticHit = staticBlogPosts.find((post) => post.slug === slug);
  if (staticHit) return staticHit;
  if (!hasDatabaseConfig()) return null;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);
    const row = rows[0];
    if (!row || row.status !== "published") return null;
    return rowToBlogPost(row);
  } catch (error) {
    console.error("[blog-posts] failed to load post", slug, error);
    return null;
  }
}

export async function listDbBlogPostMeta(): Promise<DbBlogPostMeta[]> {
  const rows = await fetchPublishedRows();
  return rows.map(rowToMeta);
}

export async function getBlogPostImage(
  slug: string,
): Promise<{ bytes: Buffer; mimeType: string } | null> {
  if (!hasDatabaseConfig()) return null;
  try {
    const db = getDb();
    const rows = await db
      .select({
        imageBytes: blogPostsTable.imageBytes,
        imageMimeType: blogPostsTable.imageMimeType,
      })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return { bytes: row.imageBytes, mimeType: row.imageMimeType };
  } catch (error) {
    console.error("[blog-posts] failed to load image bytes", slug, error);
    return null;
  }
}

export function isStaticSlug(slug: string) {
  return staticBlogPosts.some((post) => post.slug === slug);
}

export class BlogPostSlugTakenError extends Error {
  constructor(slug: string) {
    super(`Slug "${slug}" is already in use.`);
    this.name = "BlogPostSlugTakenError";
  }
}

export async function createBlogPost(input: {
  data: BlogPostCreateInput;
  imageBytes: Buffer;
  imageMimeType: string;
}): Promise<DbBlogPostMeta> {
  if (!hasDatabaseConfig()) {
    throw new Error("Database is not configured.");
  }
  const { data, imageBytes, imageMimeType } = input;

  if (isStaticSlug(data.slug)) {
    throw new BlogPostSlugTakenError(data.slug);
  }

  const db = getDb();
  const existing = await db
    .select({ id: blogPostsTable.id })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, data.slug))
    .limit(1);
  if (existing.length > 0) {
    throw new BlogPostSlugTakenError(data.slug);
  }

  const insertValues: NewBlogPostRow = {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    readTime: data.readTime,
    imageBytes,
    imageMimeType,
    body: data.body as unknown as BlogBlock[],
    status: "published",
  };

  const [row] = await db.insert(blogPostsTable).values(insertValues).returning();
  return rowToMeta(row);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!hasDatabaseConfig()) return false;
  const db = getDb();
  const rows = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .returning({ id: blogPostsTable.id });
  return rows.length > 0;
}
