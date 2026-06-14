import {
  customType,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  programId: text("program_id").notNull().default(""),
  programName: text("program_name").notNull().default(""),
  amountInr: integer("amount_inr").notNull().default(0),
  currency: text("currency").notNull().default("INR"),
  // membership lifecycle
  status: text("status").notNull().default("active"), // active | cancelled
  source: text("source").notNull().default("manual"), // manual | razorpay
  paidAt: timestamp("paid_at", { withTimezone: true }),
  planStart: date("plan_start"),
  planEnd: date("plan_end"),
  // payment references (for auto-recorded Razorpay payments)
  razorpayPaymentId: text("razorpay_payment_id").unique(),
  razorpayOrderId: text("razorpay_order_id"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MemberRow = typeof members.$inferSelect;
export type NewMemberRow = typeof members.$inferInsert;

export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  reference: text("reference").notNull().default(""), // human-friendly TIE-xxx id
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  programId: text("program_id").notNull().default(""),
  programName: text("program_name").notNull().default(""),
  goals: text("goals").notNull().default(""),
  availability: text("availability").notNull().default(""),
  // new | reviewed | converted | declined
  status: text("status").notNull().default("new"),
  convertedMemberId: uuid("converted_member_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type EnrollmentRow = typeof enrollments.$inferSelect;
export type NewEnrollmentRow = typeof enrollments.$inferInsert;

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  source: text("source").notNull().default("website"),
  // active | unsubscribed
  status: text("status").notNull().default("active"),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SubscriberRow = typeof subscribers.$inferSelect;
export type NewSubscriberRow = typeof subscribers.$inferInsert;

export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  recipientCount: integer("recipient_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CampaignRow = typeof newsletterCampaigns.$inferSelect;
export type NewCampaignRow = typeof newsletterCampaigns.$inferInsert;

export const blogPostsTable = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  category: text("category").notNull().default(""),
  readTime: text("read_time").notNull().default(""),
  imageBytes: bytea("image_bytes").notNull(),
  imageMimeType: text("image_mime_type").notNull(),
  // Array of BlogBlock objects (see lib/content/blog.ts BlogBlock type).
  body: jsonb("body").notNull().default([]),
  // published | unpublished — kept as a hook for future drafts; v1 only inserts 'published'.
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BlogPostRow = typeof blogPostsTable.$inferSelect;
export type NewBlogPostRow = typeof blogPostsTable.$inferInsert;
