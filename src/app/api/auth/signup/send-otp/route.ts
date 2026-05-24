export const runtime = "nodejs";

import { sendSignupOtp } from "@/lib/auth/otp";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ name?: string; email?: string; password?: string }>(req);
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const password = body.password || "";

    if (!name || name.length < 2) return jsonError("Name must be at least 2 characters");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Please enter a valid email");
    }
    if (!password || password.length < 8) {
      return jsonError("Password must be at least 8 characters");
    }

    const result = await sendSignupOtp(name, email, password);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
