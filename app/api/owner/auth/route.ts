import { NextResponse } from "next/server";
import { ownerSecretMatches } from "@/lib/server/github";

export async function POST(request: Request) {
  if (!process.env.OWNER_ISSUE_SECRET) {
    return NextResponse.json(
      { error: "Owner issue desk is not configured yet." },
      { status: 503 },
    );
  }

  let body: { passcode?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  if (!ownerSecretMatches(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
