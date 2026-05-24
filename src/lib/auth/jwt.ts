import jwt from "jsonwebtoken";
import type { AuthUser, User } from "./types";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return secret || "dev-jwt-secret-change-me";
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)(d|h|m|s)$/);
  if (!match) return 7 * 24 * 3600;
  const n = parseInt(match[1], 10);
  switch (match[2]) {
    case "d":
      return n * 24 * 3600;
    case "h":
      return n * 3600;
    case "m":
      return n * 60;
    case "s":
      return n;
    default:
      return 7 * 24 * 3600;
  }
}

export function signAccessToken(user: User): { accessToken: string; expiresAt: number } {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const expiresInSeconds = parseExpiresIn(expiresIn);
  const accessToken = jwt.sign({ sub: user.id, email: user.email }, getSecret(), {
    expiresIn: expiresInSeconds,
  });
  return {
    accessToken,
    expiresAt: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
}

export function verifyAccessToken(token: string): { sub: string; email: string } | null {
  try {
    const payload = jwt.verify(token, getSecret()) as { sub?: string; email?: string };
    if (!payload.sub || !payload.email) return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl ?? null,
  };
}
