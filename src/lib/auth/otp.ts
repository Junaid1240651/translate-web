import { randomInt } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, comparePassword } from "./password";
import { sendMail } from "./mail";
import { signupOtpEmail, loginOtpEmail, passwordResetOtpEmail } from "./email-templates";
import { signAccessToken, toAuthUser } from "./jwt";
import type { LoginResponse, OtpChallenge, User } from "./types";
import {
  OTP_PURPOSE_LOGIN,
  OTP_PURPOSE_SIGNUP,
  OTP_PURPOSE_PASSWORD_RESET,
} from "./types";
import * as persistence from "./persistence";
import { createRandomAvatarUrl } from "./avatar";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateSixDigitCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function assertResendCooldown(challenge: OtpChallenge | null) {
  if (!challenge) return;
  const elapsed = Date.now() - new Date(challenge.updatedAt).getTime();
  if (elapsed < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
    const err = new Error(`Please wait ${waitSec} seconds before requesting a new code.`);
    (err as Error & { status: number }).status = 429;
    throw err;
  }
}

function loginPayload(user: User): LoginResponse {
  const { accessToken, expiresAt } = signAccessToken(user);
  return {
    message: "Login successful",
    user: toAuthUser(user),
    accessToken,
    expiresAt,
  };
}

export async function createUserWithPasswordHash(
  name: string,
  email: string,
  passwordHash: string,
): Promise<User> {
  const norm = normalizeEmail(email);
  if (await persistence.findUserByEmail(norm)) {
    const err = new Error("Email already registered");
    (err as Error & { status: number }).status = 409;
    throw err;
  }

  const user: User = {
    id: uuidv4(),
    name: name.trim(),
    email: norm,
    passwordHash,
    imageUrl: createRandomAvatarUrl(),
    createdAt: new Date().toISOString(),
  };

  return persistence.createUser(user);
}

export async function sendSignupOtp(
  name: string,
  email: string,
  password: string,
): Promise<{ message: string }> {
  const norm = normalizeEmail(email);
  if (await persistence.findUserByEmail(norm)) {
    const err = new Error("Email already registered");
    (err as Error & { status: number }).status = 409;
    throw err;
  }

  const pending = await persistence.findOtpChallenge(norm, OTP_PURPOSE_SIGNUP);
  assertResendCooldown(pending);

  const plainCode = generateSixDigitCode();
  const codeHash = await hashPassword(plainCode);
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await persistence.replaceOtpChallenge({
    id: uuidv4(),
    email: norm,
    purpose: OTP_PURPOSE_SIGNUP,
    codeHash,
    expiresAt,
    attempts: 0,
    pendingName: name.trim(),
    pendingPasswordHash: passwordHash,
    updatedAt: now,
  });

  const { subject, html, text } = signupOtpEmail(plainCode);
  await sendMail(norm, subject, html, text);

  return { message: "Verification code sent to your email." };
}

export async function verifySignupAndLogin(email: string, code: string): Promise<LoginResponse> {
  const norm = normalizeEmail(email);
  const challenge = await persistence.findOtpChallenge(norm, OTP_PURPOSE_SIGNUP);
  if (!challenge) {
    const err = new Error("No pending signup for this email. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (new Date() > new Date(challenge.expiresAt)) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Code expired. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Too many failed attempts. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const ok = await comparePassword(code, challenge.codeHash);
  if (!ok) {
    await persistence.incrementOtpAttempts(challenge.id);
    const err = new Error("Invalid code");
    (err as Error & { status: number }).status = 401;
    throw err;
  }

  if (!challenge.pendingName || !challenge.pendingPasswordHash) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Invalid signup data. Start again.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  if (await persistence.findUserByEmail(norm)) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Email already registered");
    (err as Error & { status: number }).status = 409;
    throw err;
  }

  await persistence.deleteOtpChallenge(challenge.id);

  const user = await createUserWithPasswordHash(
    challenge.pendingName,
    norm,
    challenge.pendingPasswordHash,
  );
  return loginPayload(user);
}

export async function sendLoginOtp(
  email: string,
): Promise<{ message: string; codeSent: boolean }> {
  const norm = normalizeEmail(email);
  const user = await persistence.findUserByEmail(norm);

  if (!user) {
    const err = new Error(
      "No account found for this email. Please sign up or try a different email address.",
    );
    (err as Error & { status: number }).status = 404;
    throw err;
  }

  const pending = await persistence.findOtpChallenge(norm, OTP_PURPOSE_LOGIN);
  assertResendCooldown(pending);

  const plainCode = generateSixDigitCode();
  const codeHash = await hashPassword(plainCode);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await persistence.replaceOtpChallenge({
    id: uuidv4(),
    email: norm,
    purpose: OTP_PURPOSE_LOGIN,
    codeHash,
    expiresAt,
    attempts: 0,
    pendingName: null,
    pendingPasswordHash: null,
    updatedAt: now,
  });

  const { subject, html, text } = loginOtpEmail(plainCode);
  await sendMail(norm, subject, html, text);

  return {
    message: "We sent a 6-digit sign-in code to your email. It expires in 10 minutes.",
    codeSent: true,
  };
}

export async function verifyLoginOtp(email: string, code: string): Promise<LoginResponse> {
  const norm = normalizeEmail(email);
  const challenge = await persistence.findOtpChallenge(norm, OTP_PURPOSE_LOGIN);
  if (!challenge) {
    const err = new Error("No sign-in code for this email. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (new Date() > new Date(challenge.expiresAt)) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Code expired. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Too many failed attempts. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const ok = await comparePassword(code, challenge.codeHash);
  if (!ok) {
    await persistence.incrementOtpAttempts(challenge.id);
    const err = new Error("Invalid code");
    (err as Error & { status: number }).status = 401;
    throw err;
  }

  const user = await persistence.findUserByEmail(norm);
  if (!user) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Account not found.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  await persistence.deleteOtpChallenge(challenge.id);
  return loginPayload(user);
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  const user = await persistence.findUserByEmail(email);
  if (!user?.passwordHash) {
    const err = new Error("Invalid credentials");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  return loginPayload(user);
}

export async function sendPasswordResetOtp(
  email: string,
): Promise<{ message: string; codeSent: boolean }> {
  const norm = normalizeEmail(email);
  const user = await persistence.findUserByEmail(norm);

  if (!user) {
    return { message: "Account not found.", codeSent: false };
  }

  if (!user.passwordHash) {
    return {
      message: "This account has no password set. Use email code sign-in instead.",
      codeSent: false,
    };
  }

  const pending = await persistence.findOtpChallenge(norm, OTP_PURPOSE_PASSWORD_RESET);
  assertResendCooldown(pending);

  const plainCode = generateSixDigitCode();
  const codeHash = await hashPassword(plainCode);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await persistence.replaceOtpChallenge({
    id: uuidv4(),
    email: norm,
    purpose: OTP_PURPOSE_PASSWORD_RESET,
    codeHash,
    expiresAt,
    attempts: 0,
    pendingName: null,
    pendingPasswordHash: null,
    updatedAt: now,
  });

  const { subject, html, text } = passwordResetOtpEmail(plainCode);
  await sendMail(norm, subject, html, text);

  return {
    message: "We've sent a 6-digit code to your email. Enter it below with your new password.",
    codeSent: true,
  };
}

export async function resetPasswordWithOtp(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ message: string }> {
  const norm = normalizeEmail(email);
  const challenge = await persistence.findOtpChallenge(norm, OTP_PURPOSE_PASSWORD_RESET);
  if (!challenge) {
    const err = new Error("No reset request for this email. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (new Date() > new Date(challenge.expiresAt)) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Code expired. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Too many failed attempts. Request a new code.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const ok = await comparePassword(code, challenge.codeHash);
  if (!ok) {
    await persistence.incrementOtpAttempts(challenge.id);
    const err = new Error("Invalid code");
    (err as Error & { status: number }).status = 401;
    throw err;
  }

  const user = await persistence.findUserByEmail(norm);
  if (!user) {
    await persistence.deleteOtpChallenge(challenge.id);
    const err = new Error("Account not found.");
    (err as Error & { status: number }).status = 400;
    throw err;
  }

  const passwordHash = await hashPassword(newPassword);
  await persistence.deleteOtpChallenge(challenge.id);
  await persistence.updateUserPassword(user.id, passwordHash);

  return { message: "Password updated. You can sign in with your new password." };
}

export async function deleteUserAccount(userId: string): Promise<{ message: string }> {
  const user = await persistence.findUserById(userId);
  if (!user) {
    const err = new Error("User not found");
    (err as Error & { status: number }).status = 404;
    throw err;
  }

  await persistence.deleteUser(userId, user.email);
  return { message: "Account deleted" };
}
