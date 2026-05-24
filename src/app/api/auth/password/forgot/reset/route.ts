export const runtime = "nodejs";

import { resetPasswordWithOtp } from "@/lib/auth/otp";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ email?: string; code?: string; newPassword?: string }>(req);
    const email = (body.email || "").trim();
    const code = (body.code || "").trim();
    const newPassword = body.newPassword || "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Please enter a valid email");
    }
    if (!/^\d{6}$/.test(code)) {
      return jsonError("Enter the 6-digit code");
    }
    if (newPassword.length < 8) {
      return jsonError("Password must be at least 8 characters");
    }

    const result = await resetPasswordWithOtp(email, code, newPassword);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
