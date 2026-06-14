import { NextResponse } from "next/server";
import {
  escapeHtml,
  MissingEmailConfigError,
  paragraphsToHtml,
  sendOwnerEmail,
} from "@/lib/server/email";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid contact form data" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await sendOwnerEmail({
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <h3>Message</h3>
        ${paragraphsToHtml(message)}
      `,
    });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    if (error instanceof MissingEmailConfigError) {
      return NextResponse.json(
        { error: "Email is not configured yet." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
