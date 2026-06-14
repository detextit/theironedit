import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import {
  escapeHtml,
  MissingEmailConfigError,
  sendOwnerEmail,
} from "@/lib/server/email";
import { addSubscriber } from "@/lib/server/newsletter";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid subscriber data" },
      { status: 400 }
    );
  }

  const subscriber = parsed.data;
  const consentTimestamp = new Date().toISOString();

  // Persist to the subscribers list when the database is configured.
  let dbSaved = false;
  if (hasDatabaseConfig()) {
    try {
      await addSubscriber({
        email: subscriber.email,
        name: subscriber.name,
        source: subscriber.source,
      });
      dbSaved = true;
    } catch (error) {
      console.error("Failed to persist subscriber:", error);
    }
  }

  let emailSent = false;
  let emailError: unknown = null;
  try {
    await sendOwnerEmail({
      subject: `Newsletter signup: ${subscriber.email}`,
      text: [
        "New weekly email subscriber",
        `Name: ${subscriber.name || "Not provided"}`,
        `Email: ${subscriber.email}`,
        `Source: ${subscriber.source}`,
        `Consent timestamp: ${consentTimestamp}`,
      ].join("\n"),
      html: `
        <h2>New weekly email subscriber</h2>
        <p><strong>Name:</strong> ${escapeHtml(subscriber.name || "Not provided")}</p>
        <p><strong>Email:</strong> ${escapeHtml(subscriber.email)}</p>
        <p><strong>Source:</strong> ${escapeHtml(subscriber.source)}</p>
        <p><strong>Consent timestamp:</strong> ${escapeHtml(consentTimestamp)}</p>
      `,
    });
    emailSent = true;
  } catch (error) {
    emailError = error;
    if (!(error instanceof MissingEmailConfigError)) {
      console.error("Error sending newsletter signup email:", error);
    }
  }

  if (dbSaved || emailSent) {
    return NextResponse.json({
      message: "Subscriber captured for weekly emails",
    });
  }

  if (emailError instanceof MissingEmailConfigError) {
    return NextResponse.json(
      { error: "Newsletter capture is not configured yet (set EMAIL_* or DATABASE_URL)." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: "Could not capture subscriber" },
    { status: 500 }
  );
}
