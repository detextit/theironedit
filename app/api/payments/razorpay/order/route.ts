import { NextResponse } from "next/server";
import { z } from "zod";
import { getProgramById } from "@/lib/content/programs";

const orderSchema = z.object({
  enrollmentId: z.string().trim().min(1).max(80),
  programId: z.string().trim().min(1).max(80),
});

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid payment request" },
      { status: 400 }
    );
  }

  const program = getProgramById(parsed.data.programId);
  if (!program) {
    return NextResponse.json(
      { error: "Selected coaching program was not found" },
      { status: 400 }
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId;
  const amountInr = Number(process.env.RAZORPAY_ENROLLMENT_AMOUNT_INR);

  if (!keyId || !keySecret || !publicKeyId || !Number.isFinite(amountInr) || amountInr <= 0) {
    return NextResponse.json(
      {
        error:
          "Razorpay is scaffolded but not configured. Add Razorpay keys and RAZORPAY_ENROLLMENT_AMOUNT_INR.",
      },
      { status: 503 }
    );
  }

  const amount = Math.round(amountInr * 100);
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: parsed.data.enrollmentId,
      notes: {
        enrollmentId: parsed.data.enrollmentId,
        programId: parsed.data.programId,
        programName: program.name,
      },
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error("Razorpay order creation failed:", response.status, responseText);
    return NextResponse.json(
      { error: "Razorpay order could not be created" },
      { status: 502 }
    );
  }

  const order = (await response.json()) as {
    id: string;
    amount: number;
    currency: string;
  };

  return NextResponse.json({
    keyId: publicKeyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    prefill: {},
  });
}
