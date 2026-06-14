import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import { deleteSubscriber } from "@/lib/server/newsletter";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = guard();
  if (blocked) return blocked;
  if (!ownerRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const removed = await deleteSubscriber(id);
    if (!removed) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return NextResponse.json(
      { error: "Could not delete subscriber" },
      { status: 500 },
    );
  }
}
