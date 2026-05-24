import { verifyAccessToken } from "./jwt";
import { findUserById } from "./persistence";

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export async function getUserFromRequest(req: Request) {
  const token = getBearerToken(req);
  if (!token) return null;
  const payload = verifyAccessToken(token);
  if (!payload) return null;
  return findUserById(payload.sub);
}
