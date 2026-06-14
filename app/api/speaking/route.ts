import { NextResponse } from "next/server";
import {
  escapeHtml,
  MissingEmailConfigError,
  paragraphsToHtml,
  sendOwnerEmail,
} from "@/lib/server/email";
import { speakingInquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = speakingInquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message || "Invalid speaking inquiry data",
      },
      { status: 400 }
    );
  }

  const {
    organization,
    contactName,
    email,
    phone,
    eventType,
    eventDate,
    audienceSize,
    location,
    message,
  } = parsed.data;

  try {
    const textLines = [
      `Organization: ${organization}`,
      `Contact: ${contactName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      eventType ? `Event type: ${eventType}` : null,
      eventDate ? `Preferred date: ${eventDate}` : null,
      audienceSize ? `Audience size: ${audienceSize}` : null,
      location ? `Location: ${location}` : null,
      "",
      "Message:",
      message,
    ].filter(Boolean);

    const detailRows: Array<[string, string]> = [
      ["Organization", organization],
      ["Contact", contactName],
      ["Email", email],
    ];
    if (phone) detailRows.push(["Phone", phone]);
    if (eventType) detailRows.push(["Event type", eventType]);
    if (eventDate) detailRows.push(["Preferred date", eventDate]);
    if (audienceSize) detailRows.push(["Audience size", audienceSize]);
    if (location) detailRows.push(["Location", location]);

    const detailsHtml = detailRows
      .map(
        ([label, value]) =>
          `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
      )
      .join("");

    await sendOwnerEmail({
      subject: `Speaking Inquiry: ${organization}`,
      text: textLines.join("\n"),
      html: `
        <h2>New speaking inquiry</h2>
        ${detailsHtml}
        <h3>Message</h3>
        ${paragraphsToHtml(message)}
      `,
    });

    return NextResponse.json({ message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("Error sending speaking inquiry email:", error);
    if (error instanceof MissingEmailConfigError) {
      return NextResponse.json(
        { error: "Email is not configured yet." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
