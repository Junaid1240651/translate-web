export const OTP_PURPOSE_SIGNUP = "signup" as const;
export const OTP_PURPOSE_LOGIN = "login" as const;
export const OTP_PURPOSE_PASSWORD_RESET = "password_reset" as const;

export type OtpPurpose =
  | typeof OTP_PURPOSE_SIGNUP
  | typeof OTP_PURPOSE_LOGIN
  | typeof OTP_PURPOSE_PASSWORD_RESET;

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface OtpChallenge {
  id: string;
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  pendingName: string | null;
  pendingPasswordHash: string | null;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

export interface AuthDb {
  users: User[];
  otpChallenges: OtpChallenge[];
}
