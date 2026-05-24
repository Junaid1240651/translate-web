import { sendMail } from "@/lib/auth/mail";
import {
  contactAdminNotificationEmail,
  contactConfirmationEmail,
} from "@/lib/auth/email-templates";
import { CONTACT_REASONS } from "@/lib/contact-constants";
import type { User } from "@/lib/auth/types";

export interface ContactPayload {
  name?: string;
  email?: string;
  reason: string;
  subject: string;
  message: string;
}

const REASON_LABELS = Object.fromEntries(
  CONTACT_REASONS.map((r) => [r.value, r.label]),
) as Record<string, string>;

export async function submitContact(
  payload: ContactPayload,
  user: User | null,
): Promise<{ message: string }> {
  const name = (user?.name ?? payload.name ?? "").trim();
  const email = (user?.email ?? payload.email ?? "").trim().toLowerCase();

  if (!name || !email) {
    const err = new Error("Name and email are required when you are not signed in");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const err = new Error("Please enter a valid email");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const subjectLine = (payload.subject || "").trim();
  if (!subjectLine) {
    const err = new Error("Subject is required");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const message = (payload.message || "").trim();
  if (message.length < 20) {
    const err = new Error("Message must be at least 20 characters");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (message.length > 5000) {
    const err = new Error("Message must be at most 5000 characters");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const inquiryType = REASON_LABELS[payload.reason] || "General Inquiry";

  const alertTo =
    process.env.CONTACT_ALERT_EMAIL?.trim() || process.env.SMTP_USER?.trim();
  if (alertTo) {
    const admin = contactAdminNotificationEmail(
      inquiryType,
      subjectLine,
      name,
      email,
      Boolean(user),
      message,
    );
    await sendMail(alertTo, admin.subject, admin.html, admin.text);
  } else {
    console.log("[contact — no alert email configured] New submission from", email, inquiryType);
  }

  const confirmation = contactConfirmationEmail(name, inquiryType, message);
  await sendMail(email, confirmation.subject, confirmation.html, confirmation.text);

  return { message: "Thank you for your message. We will get back to you soon." };
}
