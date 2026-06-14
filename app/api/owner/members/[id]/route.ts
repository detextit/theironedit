import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import { deleteMember, updateMember } from "@/lib/server/members";
import { memberUpdateSchema } from "@/lib/validation";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = guard();
  if (blocked) return blocked;
  if (!ownerRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = memberUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid member data" },
      { status: 400 },
    );
  }

  try {
    const member = await updateMember(id, parsed.data);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ member });
  } catch (error) {
    console.error("Failed to update member:", error);
    return NextResponse.json(
      { error: "Could not update member" },
      { status: 500 },
    );
  }
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
    const removed = await deleteMember(id);
    if (!removed) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete member:", error);
    return NextResponse.json(
      { error: "Could not delete member" },
      { status: 500 },
    );
  }
}
