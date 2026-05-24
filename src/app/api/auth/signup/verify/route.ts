export const runtime = "nodejs";

import { verifySignupAndLogin } from "@/lib/auth/otp";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ email?: string; code?: string }>(req);
    const email = (body.email || "").trim();
    const code = (body.code || "").trim();

    if (!email) return jsonError("Email is required");
    if (!/^\d{6}$/.test(code)) return jsonError("Enter the 6-digit code");

    const result = await verifySignupAndLogin(email, code);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
