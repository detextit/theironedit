import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/server/db/client";
import { members, type MemberRow } from "@/lib/server/db/schema";
import { getProgramById } from "@/lib/content/programs";
import type {
  MemberCreateInput,
  MemberUpdateInput,
} from "@/lib/validation";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Parse a program duration string like "4 weeks", "12 weeks", "3 months" into days. */
export function parseDurationToDays(duration?: string): number | null {
  if (!duration) return null;
  const match = duration.match(/(\d+)\s*(day|week|month|year)/i);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const perUnit: Record<string, number> = {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
  };
  return value * (perUnit[unit] ?? 0) || null;
}

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function emptyToNull(value?: string | null): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed.length ? trimmed : null;
}

/** Compute a plan end date given a start date and an optional program id. */
export function computePlanEnd(
  planStart: string | null,
  programId?: string,
  explicitEnd?: string | null,
): string | null {
  const explicit = emptyToNull(explicitEnd);
  if (explicit) return explicit;
  const start = emptyToNull(planStart);
  if (!start) return null;
  const days = parseDurationToDays(getProgramById(programId || "")?.duration);
  if (!days) return null;
  return toDateOnly(new Date(new Date(`${start}T00:00:00Z`).getTime() + days * DAY_MS));
}

export type MemberView = MemberRow & {
  daysRemaining: number | null;
  isExpired: boolean;
  expiringSoon: boolean;
  lifecycle: "active" | "expiring" | "expired" | "cancelled" | "pending";
};

/** Decorate a row with derived lifecycle fields for the dashboard. */
export function deriveMemberView(row: MemberRow): MemberView {
  let daysRemaining: number | null = null;
  if (row.planEnd) {
    const end = new Date(`${row.planEnd}T00:00:00Z`).getTime();
    const today = new Date(`${toDateOnly(new Date())}T00:00:00Z`).getTime();
    daysRemaining = Math.round((end - today) / DAY_MS);
  }
  const isExpired = daysRemaining !== null && daysRemaining < 0;
  const expiringSoon =
    daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;

  let lifecycle: MemberView["lifecycle"];
  if (row.status === "cancelled") lifecycle = "cancelled";
  else if (daysRemaining === null) lifecycle = "pending";
  else if (isExpired) lifecycle = "expired";
  else if (expiringSoon) lifecycle = "expiring";
  else lifecycle = "active";

  return { ...row, daysRemaining, isExpired, expiringSoon, lifecycle };
}

export async function listMembers(): Promise<MemberView[]> {
  const db = getDb();
  const rows = await db.select().from(members).orderBy(desc(members.createdAt));
  return rows
    .map(deriveMemberView)
    .sort((a, b) => {
      // surface soonest-expiring active members first, cancelled last
      const rank = (m: MemberView) =>
        m.lifecycle === "cancelled" ? 3 : m.lifecycle === "pending" ? 2 : 0;
      const rd = rank(a) - rank(b);
      if (rd !== 0) return rd;
      if (a.daysRemaining === null) return 1;
      if (b.daysRemaining === null) return -1;
      return a.daysRemaining - b.daysRemaining;
    });
}

export async function createMember(
  input: MemberCreateInput,
): Promise<MemberView> {
  const db = getDb();
  const programName =
    emptyToNull(input.programName) ||
    getProgramById(input.programId || "")?.name ||
    "";
  const planStart = emptyToNull(input.planStart) || toDateOnly(new Date());
  const planEnd = computePlanEnd(planStart, input.programId, input.planEnd);
  const paidAt = emptyToNull(input.paidAt)
    ? new Date(`${input.paidAt}T00:00:00Z`)
    : new Date();

  const [row] = await db
    .insert(members)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      programId: input.programId ?? "",
      programName,
      amountInr: input.amountInr ?? 0,
      status: input.status ?? "active",
      source: "manual",
      paidAt,
      planStart,
      planEnd,
      notes: input.notes ?? "",
    })
    .returning();
  return deriveMemberView(row);
}

export async function updateMember(
  id: string,
  input: MemberUpdateInput,
): Promise<MemberView | null> {
  const db = getDb();
  const patch: Partial<typeof members.$inferInsert> = { updatedAt: new Date() };

  if (input.name !== undefined) patch.name = input.name;
  if (input.email !== undefined) patch.email = input.email;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.programId !== undefined) {
    patch.programId = input.programId;
    patch.programName =
      emptyToNull(input.programName) ||
      getProgramById(input.programId || "")?.name ||
      "";
  } else if (input.programName !== undefined) {
    patch.programName = input.programName;
  }
  if (input.amountInr !== undefined) patch.amountInr = input.amountInr;
  if (input.status !== undefined) patch.status = input.status;
  if (input.paidAt !== undefined) {
    patch.paidAt = emptyToNull(input.paidAt)
      ? new Date(`${input.paidAt}T00:00:00Z`)
      : null;
  }
  if (input.planStart !== undefined) {
    patch.planStart = emptyToNull(input.planStart);
  }
  if (input.planEnd !== undefined) {
    patch.planEnd = emptyToNull(input.planEnd);
  }
  if (input.notes !== undefined) patch.notes = input.notes;

  const [row] = await db
    .update(members)
    .set(patch)
    .where(eq(members.id, id))
    .returning();
  return row ? deriveMemberView(row) : null;
}

export async function deleteMember(id: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(members)
    .where(eq(members.id, id))
    .returning({ id: members.id });
  return rows.length > 0;
}

/** Persist a member from a verified Razorpay payment (idempotent on payment id). */
export async function recordRazorpayPayment(input: {
  name: string;
  email: string;
  phone?: string;
  programId?: string;
  amountInr: number;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
}): Promise<MemberView> {
  const db = getDb();
  const programName = getProgramById(input.programId || "")?.name || "";
  const planStart = toDateOnly(new Date());
  const planEnd = computePlanEnd(planStart, input.programId, null);

  const [row] = await db
    .insert(members)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      programId: input.programId ?? "",
      programName,
      amountInr: input.amountInr,
      status: "active",
      source: "razorpay",
      paidAt: new Date(),
      planStart,
      planEnd,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpayOrderId: input.razorpayOrderId ?? null,
    })
    .onConflictDoNothing({ target: members.razorpayPaymentId })
    .returning();

  if (row) return deriveMemberView(row);

  // Already recorded — return the existing row.
  const [existing] = await db
    .select()
    .from(members)
    .where(eq(members.razorpayPaymentId, input.razorpayPaymentId));
  return deriveMemberView(existing);
}
