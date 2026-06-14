import { NextResponse } from "next/server";
import { getProgramById } from "@/lib/content/programs";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import {
  escapeHtml,
  MissingEmailConfigError,
  paragraphsToHtml,
  sendOwnerEmail,
} from "@/lib/server/email";
import { createEnrollmentRecord } from "@/lib/server/enrollments";
import { enrollmentSchema } from "@/lib/validation";

function createEnrollmentId() {
  return `TIE-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = enrollmentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid enrollment data" },
      { status: 400 }
    );
  }

  const enrollment = parsed.data;
  const program = getProgramById(enrollment.programId);
  if (!program) {
    return NextResponse.json(
      { error: "Selected coaching program was not found" },
      { status: 400 }
    );
  }

  const enrollmentId = createEnrollmentId();

  // Persist to the database when configured (best-effort, non-fatal).
  let dbSaved = false;
  if (hasDatabaseConfig()) {
    try {
      await createEnrollmentRecord(enrollment, enrollmentId);
      dbSaved = true;
    } catch (error) {
      console.error("Failed to persist enrollment:", error);
    }
  }

  let emailSent = false;
  let emailError: unknown = null;
  try {
    await sendOwnerEmail({
      subject: `New enrollment: ${program.name} (${enrollment.name})`,
      text: [
        `Enrollment ID: ${enrollmentId}`,
        `Name: ${enrollment.name}`,
        `Email: ${enrollment.email}`,
        `Phone: ${enrollment.phone}`,
        `Program: ${program.name}`,
        "",
        "Goals:",
        enrollment.goals,
        "",
        "Availability:",
        enrollment.availability || "Not provided",
      ].join("\n"),
      html: `
        <h2>New enrollment</h2>
        <p><strong>Enrollment ID:</strong> ${escapeHtml(enrollmentId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(enrollment.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(enrollment.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(enrollment.phone)}</p>
        <p><strong>Program:</strong> ${escapeHtml(program.name)}</p>
        <h3>Goals</h3>
        ${paragraphsToHtml(enrollment.goals)}
        <h3>Availability</h3>
        ${paragraphsToHtml(enrollment.availability || "Not provided")}
      `,
    });
    emailSent = true;
  } catch (error) {
    emailError = error;
    if (!(error instanceof MissingEmailConfigError)) {
      console.error("Error sending enrollment email:", error);
    }
  }

  // Succeed if the request reached us through at least one channel.
  if (dbSaved || emailSent) {
    return NextResponse.json({
      enrollmentId,
      message:
        "Enrollment received. Ajay will review your request and send you a secure link to pay and get started.",
    });
  }

  if (emailError instanceof MissingEmailConfigError) {
    return NextResponse.json(
      { error: "Enrollment is not configured yet (set EMAIL_* or DATABASE_URL)." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { error: "Enrollment could not be submitted" },
    { status: 500 },
  );
}
