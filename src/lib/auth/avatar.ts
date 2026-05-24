import { randomUUID } from "crypto";

/** Avatar URL from Dicebear (seed controls look; fresh seed per signup for variety). */
export function randomAvatarUrl(seed: string): string {
  const encoded = encodeURIComponent(seed.trim() || String(Date.now()));
  return `https://api.dicebear.com/7.x/lorelei/png?seed=${encoded}&size=128`;
}

export function newAvatarSeed(): string {
  try {
    return randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
  }
}

export function createRandomAvatarUrl(): string {
  return randomAvatarUrl(newAvatarSeed());
}
