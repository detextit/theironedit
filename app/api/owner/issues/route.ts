import { NextResponse } from "next/server";
import {
  createGitHubIssue,
  hasGitHubConfig,
  ownerSecretMatches,
  uploadScreenshots,
  type UploadedScreenshot,
} from "@/lib/server/github";
import { ownerIssueSchema } from "@/lib/validation";

const MAX_SCREENSHOTS = 5;
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

function normalizeLabel(value: string) {
  return value.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "request"
  );
}

function issueBody({
  data,
  screenshots,
  uploadWarning,
}: {
  data: ReturnType<typeof ownerIssueSchema.parse>;
  screenshots: UploadedScreenshot[];
  uploadWarning?: string;
}) {
  const lines = [
    "## Owner request",
    "",
    `**Type:** ${data.requestType}`,
    `**Priority:** ${data.priority}`,
    `**Page/URL:** ${data.pageUrl || "Not provided"}`,
    "",
    "## Details",
    "",
    data.details,
    "",
  ];

  if (data.blogTitle || data.blogExcerpt) {
    lines.push("## Blog fields", "");
    if (data.blogTitle) lines.push(`**Blog title:** ${data.blogTitle}`);
    if (data.blogExcerpt) lines.push(`**Blog excerpt:** ${data.blogExcerpt}`);
    lines.push("");
  }

  lines.push("## Screenshots", "");
  if (screenshots.length > 0) {
    for (const shot of screenshots) {
      lines.push(`![${shot.name}](${shot.downloadUrl})`, "");
    }
    lines.push(
      "_Screenshots are committed to the `issue-assets` branch of this repo._",
    );
  } else if (uploadWarning) {
    lines.push(
      `⚠️ Screenshots were attached but could not be uploaded: ${uploadWarning}`,
    );
  } else {
    lines.push("No screenshots submitted.");
  }

  lines.push(
    "",
    "---",
    "_Filed from the owner issue desk. Intended to be resolved by the daily automation agent._",
  );

  return lines.join("\n");
}

export async function POST(request: Request) {
  const ownerSecret = process.env.OWNER_ISSUE_SECRET;
  if (!ownerSecret) {
    return NextResponse.json(
      { error: "Owner issue desk is not configured yet." },
      { status: 503 },
    );
  }

  if (!hasGitHubConfig()) {
    return NextResponse.json(
      { error: "GitHub is not configured (missing GITHUB_TOKEN)." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form data" },
      { status: 400 },
    );
  }

  if (!ownerSecretMatches(String(formData.get("ownerSecret") || ""))) {
    return NextResponse.json({ error: "Invalid owner passcode" }, { status: 401 });
  }

  const parsed = ownerIssueSchema.safeParse({
    requestType: formData.get("requestType"),
    title: formData.get("title"),
    priority: formData.get("priority"),
    pageUrl: formData.get("pageUrl"),
    details: formData.get("details"),
    blogTitle: formData.get("blogTitle"),
    blogExcerpt: formData.get("blogExcerpt"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid owner request" },
      { status: 400 },
    );
  }

  const screenshots = formData
    .getAll("screenshots")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (screenshots.length > MAX_SCREENSHOTS) {
    return NextResponse.json(
      { error: `Upload up to ${MAX_SCREENSHOTS} screenshots.` },
      { status: 400 },
    );
  }

  const oversized = screenshots.find((file) => file.size > MAX_SCREENSHOT_BYTES);
  if (oversized) {
    return NextResponse.json(
      { error: `${oversized.name} is larger than 5MB.` },
      { status: 400 },
    );
  }

  const data = parsed.data;

  let uploaded: UploadedScreenshot[] = [];
  let uploadWarning: string | undefined;
  if (screenshots.length > 0) {
    try {
      const slug = `${Date.now()}-${slugify(data.title)}`;
      uploaded = await uploadScreenshots(screenshots, slug);
    } catch (error) {
      // Non-fatal: still create the issue, but flag that screenshots failed.
      // The most common cause is a token missing "Contents: Read and write".
      console.error("Screenshot upload failed:", error);
      uploadWarning =
        error instanceof Error
          ? error.message
          : "Unknown screenshot upload error";
    }
  }

  const labels = [
    "owner-request",
    "website",
    normalizeLabel(data.requestType),
    `priority-${normalizeLabel(data.priority)}`,
  ];

  const issueResult = await createGitHubIssue({
    title: data.title,
    body: issueBody({ data, screenshots: uploaded, uploadWarning }),
    labels,
  });

  if (!issueResult.ok) {
    return NextResponse.json(
      { error: issueResult.error },
      { status: issueResult.status },
    );
  }

  return NextResponse.json({
    message: uploadWarning
      ? "Issue created, but screenshots could not be uploaded (check the token's Contents permission)."
      : "Owner request created",
    issueUrl: issueResult.issueUrl,
    issueNumber: issueResult.issueNumber,
    screenshotCount: uploaded.length,
    uploadWarning,
  });
}
