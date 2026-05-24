export const runtime = "nodejs";

import { toAuthUser } from "@/lib/auth/jwt";
import { getUserFromRequest } from "@/lib/auth/session";
import { jsonError } from "@/lib/auth/http";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return jsonError("Unauthorized", 401);
  }
  return Response.json({ user: toAuthUser(user) });
}
