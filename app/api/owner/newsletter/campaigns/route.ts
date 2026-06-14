import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import { listCampaigns } from "@/lib/server/newsletter";

function guard() {
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
  return null;
}

export async function GET(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  if (!ownerRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaigns = await listCampaigns();
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Failed to list campaigns:", error);
    return NextResponse.json(
      { error: "Could not load campaign history" },
      { status: 500 },
    );
  }
}
