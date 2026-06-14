import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import {
  hasOwnerSecretConfig,
  ownerRequestAuthorized,
  ownerSecretMatches,
} from "@/lib/server/github";
import {
  BlogPostSlugTakenError,
  createBlogPost,
  listDbBlogPostMeta,
} from "@/lib/server/blog-posts";
import { blogPostCreateSchema } from "@/lib/validation";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

function guard() {
  if (!hasOwnerSecretConfig()) {
    return NextResponse.json(
      {
        error:
          "Owner dashboard is not configured yet (set OWNER_ISSUE_SECRET).",
      },
      { status: 503 },
    );
  }
  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Database is not configured yet (set DATABASE_URL)." },
      { status: 503 },
    );
  }
  return null;
}

export async function GET(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  if (!ownerRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await listDbBlogPostMeta();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to list blog posts:", error);
    return NextResponse.json(
      { error: "Could not load blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form data" },
      { status: 400 },
    );
  }

  // Accept the passcode either as a form field (for the composer's upload
  // request) or via the standard x-owner-secret header for consistency
  // with the other owner routes.
  const headerSecret = request.headers.get("x-owner-secret") || "";
  const fieldSecret = String(formData.get("ownerSecret") || "");
  if (
    !ownerSecretMatches(headerSecret) &&
    !ownerSecretMatches(fieldSecret)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json(
      { error: "Missing JSON payload" },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    return NextResponse.json(
      { error: "Payload is not valid JSON" },
      { status: 400 },
    );
  }

  const parsed = blogPostCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid blog post" },
      { status: 400 },
    );
  }

  const imageRaw = formData.get("image");
  if (!(imageRaw instanceof File) || imageRaw.size === 0) {
    return NextResponse.json(
      { error: "A cover image is required" },
      { status: 400 },
    );
  }
  if (imageRaw.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Cover image must be 4 MB or smaller" },
      { status: 400 },
    );
  }
  const mimeType = imageRaw.type || "application/octet-stream";
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: "Cover image must be JPEG, PNG, WebP, AVIF or GIF" },
      { status: 400 },
    );
  }

  const imageBytes = Buffer.from(await imageRaw.arrayBuffer());

  try {
    const post = await createBlogPost({
      data: parsed.data,
      imageBytes,
      imageMimeType: mimeType,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof BlogPostSlugTakenError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { error: "Could not publish blog post" },
      { status: 500 },
    );
  }
}
