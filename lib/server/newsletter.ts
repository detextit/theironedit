import { createHmac, timingSafeEqual } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/server/db/client";
import {
  newsletterCampaigns,
  subscribers,
  type CampaignRow,
  type SubscriberRow,
} from "@/lib/server/db/schema";
import {
  escapeHtml,
  paragraphsToHtml,
  sendSubscriberEmail,
} from "@/lib/server/email";

function unsubSecret() {
  return (
    process.env.NEWSLETTER_SECRET || process.env.OWNER_ISSUE_SECRET || ""
  );
}

export function unsubscribeToken(email: string) {
  return createHmac("sha256", unsubSecret())
    .update(email.toLowerCase())
    .digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string) {
  const expected = unsubscribeToken(email);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Add or reactivate a subscriber (idempotent on email). */
export async function addSubscriber(input: {
  email: string;
  name?: string;
  source?: string;
}): Promise<SubscriberRow> {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const [row] = await db
    .insert(subscribers)
    .values({
      email,
      name: input.name ?? "",
      source: input.source ?? "website",
      status: "active",
    })
    .onConflictDoUpdate({
      target: subscribers.email,
      set: {
        status: "active",
        unsubscribedAt: null,
        name: input.name ?? "",
        updatedAt: new Date(),
      },
    })
    .returning();
  return row;
}

export async function listSubscribers(): Promise<SubscriberRow[]> {
  const db = getDb();
  return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
}

export async function listActiveSubscribers(): Promise<SubscriberRow[]> {
  const db = getDb();
  return db
    .select()
    .from(subscribers)
    .where(eq(subscribers.status, "active"))
    .orderBy(desc(subscribers.createdAt));
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(subscribers)
    .where(eq(subscribers.id, id))
    .returning({ id: subscribers.id });
  return rows.length > 0;
}

export async function unsubscribeByEmail(
  email: string,
): Promise<SubscriberRow | null> {
  const db = getDb();
  const [row] = await db
    .update(subscribers)
    .set({
      status: "unsubscribed",
      unsubscribedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscribers.email, email.trim().toLowerCase()))
    .returning();
  return row ?? null;
}

export async function listCampaigns(): Promise<CampaignRow[]> {
  const db = getDb();
  return db
    .select()
    .from(newsletterCampaigns)
    .orderBy(desc(newsletterCampaigns.sentAt))
    .limit(20);
}

function buildEmail(
  subject: string,
  body: string,
  email: string,
  baseUrl: string,
) {
  const unsubUrl = `${baseUrl}/unsubscribe?e=${encodeURIComponent(
    email,
  )}&t=${unsubscribeToken(email)}`;
  const textBody = `${body}\n\n—\nThe Iron Edit\nUnsubscribe: ${unsubUrl}`;
  const htmlBody = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a191b; line-height: 1.6;">
      ${paragraphsToHtml(body)}
      <hr style="border: none; border-top: 1px solid #e5e3e8; margin: 28px 0 16px;" />
      <p style="font-size: 12px; color: #8b8792;">
        You are receiving this because you subscribed to The Iron Edit.
        <a href="${escapeHtml(unsubUrl)}" style="color: #8b8792;">Unsubscribe</a>.
      </p>
    </div>`;
  return { textBody, htmlBody };
}

/**
 * Send a campaign to every active subscriber. Each recipient gets their own
 * email with a personal unsubscribe link. Logs the campaign and returns counts.
 */
export async function sendCampaign(
  subject: string,
  body: string,
  baseUrl: string,
): Promise<{ recipientCount: number; failedCount: number; total: number }> {
  const db = getDb();
  const recipients = await listActiveSubscribers();

  let sent = 0;
  let failed = 0;
  for (const sub of recipients) {
    const { textBody, htmlBody } = buildEmail(subject, body, sub.email, baseUrl);
    try {
      await sendSubscriberEmail({
        to: sub.email,
        subject,
        text: textBody,
        html: htmlBody,
      });
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error(`Failed to send newsletter to ${sub.email}:`, error);
    }
  }

  await db.insert(newsletterCampaigns).values({
    subject,
    body,
    recipientCount: sent,
    failedCount: failed,
  });

  return { recipientCount: sent, failedCount: failed, total: recipients.length };
}
