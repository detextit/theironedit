import crypto from "crypto";
import { NextResponse } from "next/server";

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Razorpay webhook is not configured yet." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Razorpay signature" },
      { status: 400 }
    );
  }

  const payload = await request.text();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (!signaturesMatch(signature, expected)) {
    return NextResponse.json(
      { error: "Invalid Razorpay webhook signature" },
      { status: 401 }
    );
  }

  let event: { event?: string };
  try {
    event = JSON.parse(payload) as { event?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid Razorpay webhook payload" },
      { status: 400 }
    );
  }

  console.info("Received Razorpay webhook:", event.event || "unknown");

  return NextResponse.json({ received: true });
}
