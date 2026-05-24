export const runtime = "nodejs";

import { verifyLoginOtp } from "@/lib/auth/otp";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ email?: string; code?: string }>(req);
    const email = (body.email || "").trim();
    const code = (body.code || "").trim();

    if (!email) return jsonError("Email is required");
    if (!/^\d{6}$/.test(code)) return jsonError("Enter the 6-digit code");

    const result = await verifyLoginOtp(email, code);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
