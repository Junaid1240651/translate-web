export const runtime = "nodejs";

import { loginWithPassword } from "@/lib/auth/otp";
import { handleRouteError, jsonError, parseJsonBody } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ email?: string; password?: string }>(req);
    const email = (body.email || "").trim();
    const password = body.password || "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Please enter a valid email");
    }
    if (!password) return jsonError("Password is required");

    const result = await loginWithPassword(email, password);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
