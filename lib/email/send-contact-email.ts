import { Resend } from "resend";
import nodemailer from "nodemailer";

export type ContactEmailInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildBodies({ name, email, subject, message }: ContactEmailInput) {
  const text = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1a2e33;">
      <h2 style="margin: 0 0 12px;">New contact form submission</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p style="margin: 0 0 6px;"><strong>Message:</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `.trim();

  return { text, html };
}

function getToAddress(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || "info@xoomplus.co.uk";
}

function getFromAddress(): string {
  return (
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Xoomplus <onboarding@resend.dev>"
  );
}

async function sendWithResend(input: ContactEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const { text, html } = buildBodies(input);
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [getToAddress()],
    replyTo: input.email,
    subject: `[Contact] ${input.subject}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send email.");
  }
}

async function sendWithSmtp(input: ContactEmailInput): Promise<void> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || "587");

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });

  const { text, html } = buildBodies(input);

  await transporter.sendMail({
    from: getFromAddress(),
    to: getToAddress(),
    replyTo: input.email,
    subject: `[Contact] ${input.subject}`,
    text,
    html,
  });
}

/**
 * Sends contact mail via Resend (preferred) or SMTP.
 */
export async function sendContactEmail(
  input: ContactEmailInput,
): Promise<{ provider: "resend" | "smtp" }> {
  if (process.env.RESEND_API_KEY?.trim()) {
    await sendWithResend(input);
    return { provider: "resend" };
  }

  if (process.env.SMTP_HOST?.trim()) {
    await sendWithSmtp(input);
    return { provider: "smtp" };
  }

  throw new Error(
    "Email is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS.",
  );
}
