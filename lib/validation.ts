import { z } from "zod";

const requiredText = z.string().trim().min(1, "This field is required");

export const contactSchema = z.object({
  name: requiredText.max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  subject: requiredText.max(160),
  message: requiredText.max(4000),
});

export const speakingInquirySchema = z.object({
  organization: requiredText.max(160),
  contactName: requiredText.max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  eventType: z.string().trim().max(120).optional().default(""),
  eventDate: z.string().trim().max(80).optional().default(""),
  audienceSize: z.string().trim().max(80).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  message: requiredText.max(4000),
});

export const newsletterSchema = z.object({
  name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Enter a valid email address").max(200),
  source: z.string().trim().max(120).optional().default("website"),
});

export const enrollmentSchema = z.object({
  name: requiredText.max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: requiredText.max(40),
  programId: requiredText.max(80),
  goals: requiredText.max(2000),
  availability: z.string().trim().max(1000).optional().default(""),
  paymentIntent: z.enum(["pay-online", "coach-review"]).default("coach-review"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required before enrolling" }),
  }),
});

export const ownerIssueSchema = z.object({
  requestType: z.enum([
    "website-issue",
    "content-update",
    "enrollment-pricing",
    "newsletter",
  ]),
  title: requiredText.max(160),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  pageUrl: z.string().trim().max(300).optional().default(""),
  details: requiredText.max(6000),
});

const optionalDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .optional()
  .or(z.literal(""));

export const memberCreateSchema = z.object({
  name: requiredText.max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  programId: z.string().trim().max(80).optional().default(""),
  programName: z.string().trim().max(120).optional().default(""),
  amountInr: z.coerce.number().int().min(0).max(100000000).optional().default(0),
  status: z.enum(["active", "cancelled"]).optional().default("active"),
  paidAt: optionalDate,
  planStart: optionalDate,
  planEnd: optionalDate,
  notes: z.string().trim().max(2000).optional().default(""),
});

export const memberUpdateSchema = memberCreateSchema.partial();

export const enrollmentStatusSchema = z.object({
  status: z.enum(["new", "reviewed", "converted", "declined"]),
});

export const enrollmentConvertSchema = z.object({
  amountInr: z.coerce.number().int().min(0).max(100000000).optional().default(0),
  paidAt: optionalDate,
  planStart: optionalDate,
  planEnd: optionalDate,
  notes: z.string().trim().max(2000).optional().default(""),
});

export const newsletterCampaignSchema = z.object({
  subject: requiredText.max(200),
  body: requiredText.max(20000),
});

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: requiredText.max(4000) }),
  z.object({ type: z.literal("heading"), text: requiredText.max(200) }),
  z.object({ type: z.literal("subheading"), text: requiredText.max(200) }),
  z.object({ type: z.literal("callout"), text: requiredText.max(2000) }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().optional().default(false),
    items: z.array(requiredText.max(500)).min(1).max(50),
  }),
]);

export const blogPostCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(slugRegex, "Use lowercase letters, numbers and hyphens only"),
  title: requiredText.max(200),
  excerpt: z.string().trim().max(500).optional().default(""),
  category: z.string().trim().max(80).optional().default(""),
  readTime: z.string().trim().max(40).optional().default(""),
  body: z.array(blogBlockSchema).min(1, "Add at least one block").max(200),
});

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
export type EnrollmentConvertInput = z.infer<typeof enrollmentConvertSchema>;
export type NewsletterCampaignInput = z.infer<typeof newsletterCampaignSchema>;

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type OwnerIssueInput = z.infer<typeof ownerIssueSchema>;
export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;
export type BlogBlockInput = z.infer<typeof blogBlockSchema>;
export type SpeakingInquiryInput = z.infer<typeof speakingInquirySchema>;
