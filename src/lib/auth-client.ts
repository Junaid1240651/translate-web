import type { AuthUser, LoginResponse } from "@/lib/auth/types";

const TOKEN_KEY = "vt_access_token";
const USER_KEY = "vt_user";
const EXPIRES_KEY = "vt_expires_at";

export function saveAuthSession(data: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(EXPIRES_KEY, String(data.expiresAt));
  window.dispatchEvent(new Event("vt-auth-changed"));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  window.dispatchEvent(new Event("vt-auth-changed"));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isSessionExpired(): boolean {
  const raw = localStorage.getItem(EXPIRES_KEY);
  if (!raw) return true;
  const expiresAt = parseInt(raw, 10);
  return Number.isFinite(expiresAt) && expiresAt <= Math.floor(Date.now() / 1000);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token || isSessionExpired()) {
    clearAuthSession();
    return null;
  }

  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    clearAuthSession();
    return null;
  }

  const data = (await res.json()) as { user: AuthUser };
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

async function parseAuthResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : typeof data.detail === "string"
          ? data.detail
          : "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function signupSendOtp(payload: { name: string; email: string; password: string }) {
  const res = await fetch("/api/auth/signup/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<{ message: string }>;
}

export async function signupVerify(payload: { email: string; code: string }) {
  const res = await fetch("/api/auth/signup/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<LoginResponse>;
}

export async function loginSendOtp(payload: { email: string }) {
  const res = await fetch("/api/auth/login/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<{ message: string; codeSent: boolean }>;
}

export async function loginVerifyOtp(payload: { email: string; code: string }) {
  const res = await fetch("/api/auth/login/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<LoginResponse>;
}

export async function loginWithPassword(payload: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<LoginResponse>;
}

export async function forgotPasswordSendOtp(payload: { email: string }) {
  const res = await fetch("/api/auth/password/forgot/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<{ message: string; codeSent: boolean }>;
}

export async function forgotPasswordReset(payload: {
  email: string;
  code: string;
  newPassword: string;
}) {
  const res = await fetch("/api/auth/password/forgot/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res) as Promise<{ message: string }>;
}

export async function deleteAccount() {
  const token = getAccessToken();
  if (!token) throw new Error("Not signed in");

  const res = await fetch("/api/auth/delete-account", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseAuthResponse(res) as Promise<{ message: string }>;
}

export interface AccountSubscription {
  planId: string;
  planName: string;
  status: string;
  activationKey: string;
  amount: number;
  currency: string;
  startsAt: string;
  expiresAt: string;
  customerEmail: string;
  customerName: string | null;
  isActive?: boolean;
}

export interface AccountPayment {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
  razorpayPaymentId: string;
}

export async function fetchAccountSubscription(): Promise<{
  subscription: AccountSubscription | null;
  payments: AccountPayment[];
}> {
  const token = getAccessToken();
  if (!token) throw new Error("Not signed in");

  const res = await fetch("/api/subscriptions/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseAuthResponse(res) as Promise<{
    subscription: AccountSubscription | null;
    payments: AccountPayment[];
  }>;
}
