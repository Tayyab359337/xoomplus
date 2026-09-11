import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email/send-contact-email";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Contact form endpoint — validates payload and emails info@xoomplus.co.uk.
 */
export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const subject = asTrimmedString(body.subject);
  const message = asTrimmedString(body.message);

  const fieldErrors: Partial<
    Record<"name" | "email" | "subject" | "message", string>
  > = {};

  if (!name) fieldErrors.name = "Please enter your name.";
  if (!email) fieldErrors.email = "Please enter your email.";
  else if (!isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!subject) fieldErrors.subject = "Please enter a subject.";
  if (!message) fieldErrors.message = "Please write a message.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { provider } = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      ok: true,
      message: "Message sent.",
      provider,
    });
  } catch (error) {
    console.error("[contact] send failed", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again later.",
      },
      { status: 502 },
    );
  }
}
