import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import {
  deleteEnrollment,
  updateEnrollmentStatus,
} from "@/lib/server/enrollments";
import { enrollmentStatusSchema } from "@/lib/validation";

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

  const parsed = enrollmentStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid status" },
      { status: 400 },
    );
  }

  try {
    const enrollment = await updateEnrollmentStatus(id, parsed.data.status);
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("Failed to update enrollment:", error);
    return NextResponse.json(
      { error: "Could not update enrollment" },
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
    const removed = await deleteEnrollment(id);
    if (!removed) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete enrollment:", error);
    return NextResponse.json(
      { error: "Could not delete enrollment" },
      { status: 500 },
    );
  }
}
