import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseConfig } from "@/lib/server/db/client";
import { recordRazorpayPayment } from "@/lib/server/members";

const verifySchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
  // Optional enrollment context so a paid member can be auto-recorded.
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(200).optional(),
  phone: z.string().trim().max(40).optional(),
  programId: z.string().trim().max(80).optional(),
  amountInr: z.coerce.number().int().min(0).max(100000000).optional(),
});

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay verification is not configured yet." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid payment response" },
      { status: 400 }
    );
  }

  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = parsed.data;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!signaturesMatch(signature, expected)) {
    return NextResponse.json(
      { error: "Payment signature verification failed" },
      { status: 400 }
    );
  }

  // Payment is verified. Best-effort record the paying member; never fail the
  // response if persistence is unavailable (the payment already succeeded).
  const { name, email } = parsed.data;
  if (hasDatabaseConfig() && name && email) {
    try {
      await recordRazorpayPayment({
        name,
        email,
        phone: parsed.data.phone,
        programId: parsed.data.programId,
        amountInr: parsed.data.amountInr ?? 0,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
      });
    } catch (error) {
      console.error("Failed to record paid member:", error);
    }
  }

  return NextResponse.json({ verified: true });
}
