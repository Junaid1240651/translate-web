import type { ContactReason } from "./contact-constants";
import { getAccessToken } from "./auth-client";

export interface ContactPayload {
  name: string;
  email: string;
  reason: ContactReason;
  subject: string;
  message: string;
}

export async function submitContactForm(payload: ContactPayload) {
  const token = getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch("/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    let message = "Failed to send message. Please try again.";
    if (typeof data.message === "string") message = data.message;
    else if (typeof data.detail === "string") message = data.detail;
    throw new Error(message);
  }

  return data;
}
