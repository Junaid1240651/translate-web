export const runtime = "nodejs";

import { sendLoginOtp } from "@/lib/auth/otp";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ email?: string }>(req);
    const email = (body.email || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Please enter a valid email");
    }

    const result = await sendLoginOtp(email);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
