export const runtime = "nodejs";

import { getUserFromRequest } from "@/lib/auth/session";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";
import { submitContact } from "@/lib/contact/service";
import { CONTACT_REASONS } from "@/lib/contact-constants";

const VALID_REASONS = new Set(CONTACT_REASONS.map((r) => r.value));

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{
      name?: string;
      email?: string;
      reason?: string;
      subject?: string;
      message?: string;
    }>(req);

    const reason = body.reason || "general";
    if (!VALID_REASONS.has(reason as (typeof CONTACT_REASONS)[number]["value"])) {
      return jsonError("Invalid inquiry type");
    }

    const user = await getUserFromRequest(req);
    const result = await submitContact(
      {
        name: body.name,
        email: body.email,
        reason,
        subject: body.subject || "",
        message: body.message || "",
      },
      user,
    );

    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
