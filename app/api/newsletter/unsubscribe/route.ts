import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import {
  unsubscribeByEmail,
  verifyUnsubscribeToken,
} from "@/lib/server/newsletter";

export async function POST(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet." },
      { status: 503 },
    );
  }

  let body: { email?: unknown; token?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const token = typeof body.token === "string" ? body.token : "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.json(
      { error: "This unsubscribe link is invalid or has expired." },
      { status: 400 },
    );
  }

  try {
    await unsubscribeByEmail(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to unsubscribe:", error);
    return NextResponse.json(
      { error: "Could not unsubscribe. Please try again." },
      { status: 500 },
    );
  }
}
