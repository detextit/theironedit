import { z } from "zod";

const requiredText = z.string().trim().min(1, "This field is required");

export const contactSchema = z.object({
  name: requiredText.max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  subject: requiredText.max(160),
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
    "blog-post",
    "enrollment-pricing",
    "newsletter",
  ]),
  title: requiredText.max(160),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  pageUrl: z.string().trim().max(300).optional().default(""),
  details: requiredText.max(6000),
  blogTitle: z.string().trim().max(180).optional().default(""),
  blogExcerpt: z.string().trim().max(500).optional().default(""),
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

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
export type EnrollmentConvertInput = z.infer<typeof enrollmentConvertSchema>;
export type NewsletterCampaignInput = z.infer<typeof newsletterCampaignSchema>;

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type OwnerIssueInput = z.infer<typeof ownerIssueSchema>;
