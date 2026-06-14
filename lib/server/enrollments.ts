import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/server/db/client";
import { enrollments, type EnrollmentRow } from "@/lib/server/db/schema";
import { getProgramById } from "@/lib/content/programs";
import { createMember, type MemberView } from "@/lib/server/members";
import type { EnrollmentInput, MemberCreateInput } from "@/lib/validation";

export const ENROLLMENT_STATUSES = [
  "new",
  "reviewed",
  "converted",
  "declined",
] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

/** Persist a submitted enrollment request. Best-effort; caller emails regardless. */
export async function createEnrollmentRecord(
  input: EnrollmentInput,
  reference: string,
): Promise<EnrollmentRow> {
  const db = getDb();
  const programName = getProgramById(input.programId)?.name || "";
  const [row] = await db
    .insert(enrollments)
    .values({
      reference,
      name: input.name,
      email: input.email,
      phone: input.phone,
      programId: input.programId,
      programName,
      goals: input.goals,
      availability: input.availability ?? "",
      status: "new",
    })
    .returning();
  return row;
}

export async function listEnrollments(): Promise<EnrollmentRow[]> {
  const db = getDb();
  return db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
}

export async function updateEnrollmentStatus(
  id: string,
  status: EnrollmentStatus,
): Promise<EnrollmentRow | null> {
  const db = getDb();
  const [row] = await db
    .update(enrollments)
    .set({ status, updatedAt: new Date() })
    .where(eq(enrollments.id, id))
    .returning();
  return row ?? null;
}

export async function deleteEnrollment(id: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(enrollments)
    .where(eq(enrollments.id, id))
    .returning({ id: enrollments.id });
  return rows.length > 0;
}

/**
 * Convert an enrollment request into a paid member after payment is received.
 * Creates the member record, then marks the enrollment converted.
 */
export async function convertEnrollmentToMember(
  id: string,
  payment: Pick<
    MemberCreateInput,
    "amountInr" | "paidAt" | "planStart" | "planEnd" | "notes"
  >,
): Promise<{ member: MemberView; enrollment: EnrollmentRow } | null> {
  const db = getDb();
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, id));
  if (!enrollment) return null;

  const member = await createMember({
    name: enrollment.name,
    email: enrollment.email,
    phone: enrollment.phone,
    programId: enrollment.programId,
    programName: enrollment.programName,
    amountInr: payment.amountInr ?? 0,
    status: "active",
    paidAt: payment.paidAt ?? "",
    planStart: payment.planStart ?? "",
    planEnd: payment.planEnd ?? "",
    notes: payment.notes ?? "",
  });

  const [updated] = await db
    .update(enrollments)
    .set({
      status: "converted",
      convertedMemberId: member.id,
      updatedAt: new Date(),
    })
    .where(eq(enrollments.id, id))
    .returning();

  return { member, enrollment: updated };
}
