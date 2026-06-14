import nodemailer, { type SendMailOptions } from "nodemailer";

export class MissingEmailConfigError extends Error {
  constructor() {
    super("Email is not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD.");
    this.name = "MissingEmailConfigError";
  }
}

export function hasEmailConfig() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function paragraphsToHtml(value: string) {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export async function sendOwnerEmail({
  subject,
  text,
  html,
  attachments,
}: {
  subject: string;
  text: string;
  html: string;
  attachments?: SendMailOptions["attachments"];
}) {
  if (!hasEmailConfig()) {
    throw new MissingEmailConfigError();
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject,
    text,
    html,
    attachments,
  });
}

function getTransporter() {
  if (!hasEmailConfig()) {
    throw new MissingEmailConfigError();
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send one email to a single subscriber (To: them, From: the coach).
 * Used for newsletter delivery so each recipient gets a private copy.
 */
export async function sendSubscriberEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}
