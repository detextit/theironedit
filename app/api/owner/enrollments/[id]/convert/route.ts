import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { hasOwnerSecretConfig, ownerRequestAuthorized } from "@/lib/server/github";
import { convertEnrollmentToMember } from "@/lib/server/enrollments";
import { enrollmentConvertSchema } from "@/lib/validation";

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

export async function POST(
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

  const parsed = enrollmentConvertSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid payment data" },
      { status: 400 },
    );
  }

  try {
    const result = await convertEnrollmentToMember(id, parsed.data);
    if (!result) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to convert enrollment:", error);
    return NextResponse.json(
      { error: "Could not convert enrollment to a paid member" },
      { status: 500 },
    );
  }
}
