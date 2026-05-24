import { isDatabaseConfigured } from "./db";
import * as repo from "./repository";
import { readDb, updateDb } from "./store";
import type { OtpChallenge, OtpPurpose, User } from "./types";

export async function findUserByEmail(email: string): Promise<User | null> {
  const norm = email.trim().toLowerCase();
  if (isDatabaseConfigured()) {
    return repo.findUserByEmail(norm);
  }
  const found = readDb().users.find((u) => u.email.toLowerCase() === norm);
  return found ? { ...found, imageUrl: found.imageUrl ?? null } : null;
}

export async function findUserById(id: string): Promise<User | null> {
  if (isDatabaseConfigured()) {
    return repo.findUserById(id);
  }
  const found = readDb().users.find((u) => u.id === id);
  return found ? { ...found, imageUrl: found.imageUrl ?? null } : null;
}

export async function createUser(user: User): Promise<User> {
  if (isDatabaseConfigured()) {
    return repo.insertUser(user);
  }
  updateDb((db) => {
    db.users.push(user);
  });
  return user;
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  if (isDatabaseConfigured()) {
    await repo.updateUserPassword(userId, passwordHash);
    return;
  }
  updateDb((db) => {
    const target = db.users.find((u) => u.id === userId);
    if (target) target.passwordHash = passwordHash;
  });
}

export async function deleteUser(userId: string, email: string): Promise<void> {
  const norm = email.toLowerCase();
  if (isDatabaseConfigured()) {
    await repo.deleteUserById(userId, norm);
    return;
  }
  updateDb((db) => {
    db.users = db.users.filter((u) => u.id !== userId);
    db.otpChallenges = db.otpChallenges.filter((c) => c.email === norm);
  });
}

export async function findOtpChallenge(
  email: string,
  purpose: OtpPurpose,
): Promise<OtpChallenge | null> {
  const norm = email.trim().toLowerCase();
  if (isDatabaseConfigured()) {
    return repo.findOtpChallenge(norm, purpose);
  }
  return dbChallenge(readDb().otpChallenges.find((c) => c.email === norm && c.purpose === purpose));
}

function dbChallenge(challenge: OtpChallenge | undefined): OtpChallenge | null {
  return challenge ?? null;
}

export async function replaceOtpChallenge(challenge: OtpChallenge): Promise<void> {
  if (isDatabaseConfigured()) {
    await repo.replaceOtpChallenge(challenge);
    return;
  }
  updateDb((db) => {
    db.otpChallenges = db.otpChallenges.filter(
      (c) => !(c.email === challenge.email && c.purpose === challenge.purpose),
    );
    db.otpChallenges.push(challenge);
  });
}

export async function deleteOtpChallenge(id: string): Promise<void> {
  if (isDatabaseConfigured()) {
    await repo.deleteOtpChallengeById(id);
    return;
  }
  updateDb((db) => {
    db.otpChallenges = db.otpChallenges.filter((c) => c.id !== id);
  });
}

export async function incrementOtpAttempts(id: string): Promise<void> {
  if (isDatabaseConfigured()) {
    await repo.incrementOtpAttempts(id);
    return;
  }
  updateDb((db) => {
    const item = db.otpChallenges.find((c) => c.id === id);
    if (item) item.attempts += 1;
  });
}
