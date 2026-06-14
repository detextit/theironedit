import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasEmailConfig } from "@/lib/server/email";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import { sendCampaign } from "@/lib/server/newsletter";
import { newsletterCampaignSchema } from "@/lib/validation";

function baseUrlFrom(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!hasOwnerSecretConfig()) {
    return NextResponse.json(
      { error: "Owner dashboard is not configured yet (set OWNER_ISSUE_SECRET)." },
      { status: 503 },
    );
  }
  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Database is not configured yet (set DATABASE_URL)." },
      { status: 503 },
    );
  }
  if (!hasEmailConfig()) {
    return NextResponse.json(
      { error: "Email is not configured yet (set EMAIL_USER and EMAIL_APP_PASSWORD)." },
      { status: 503 },
    );
  }
  if (!ownerRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = newsletterCampaignSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid newsletter data" },
      { status: 400 },
    );
  }

  try {
    const result = await sendCampaign(
      parsed.data.subject,
      parsed.data.body,
      baseUrlFrom(request),
    );
    if (result.total === 0) {
      return NextResponse.json(
        { error: "There are no active subscribers to send to yet." },
        { status: 400 },
      );
    }
    return NextResponse.json({
      message: `Sent to ${result.recipientCount} of ${result.total} subscribers${
        result.failedCount ? ` (${result.failedCount} failed)` : ""
      }.`,
      ...result,
    });
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return NextResponse.json(
      { error: "Could not send the newsletter" },
      { status: 500 },
    );
  }
}
