import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import { createMember, listMembers } from "@/lib/server/members";
import { memberCreateSchema } from "@/lib/validation";

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
    const members = await listMembers();
    return NextResponse.json({ members });
  } catch (error) {
    console.error("Failed to list members:", error);
    return NextResponse.json(
      { error: "Could not load members" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  if (!ownerRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = memberCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid member data" },
      { status: 400 },
    );
  }

  try {
    const member = await createMember(parsed.data);
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Failed to create member:", error);
    return NextResponse.json(
      { error: "Could not create member" },
      { status: 500 },
    );
  }
}
