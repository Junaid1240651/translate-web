import crypto from "crypto";

const KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateActivationKey(): string {
  const bytes = crypto.randomBytes(16);
  let raw = "";
  for (let i = 0; i < 16; i++) {
    raw += KEY_CHARS[bytes[i]! % KEY_CHARS.length];
  }
  return raw.match(/.{1,4}/g)!.join("-");
}

export function normalizeActivationKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function formatActivationKey(key: string): string {
  const raw = normalizeActivationKey(key);
  if (raw.length !== 16) return key.trim().toUpperCase();
  return raw.match(/.{1,4}/g)!.join("-");
}
