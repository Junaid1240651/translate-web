export const runtime = "nodejs";

import { deleteUserAccount } from "@/lib/auth/otp";
import { getUserFromRequest } from "@/lib/auth/session";
import { handleRouteError, jsonError } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return jsonError("Unauthorized", 401);

    const result = await deleteUserAccount(user.id);
    return Response.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
