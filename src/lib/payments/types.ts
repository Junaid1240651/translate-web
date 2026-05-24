import type { PaidPlanId } from "@/lib/payments/plans";

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface PaymentRecord {
  id: string;
  subscriptionId: string | null;
  userId: string | null;
  planId: PaidPlanId;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customerEmail: string;
  customerName: string | null;
  status: string;
  paidAt: string;
  createdAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string | null;
  paymentId: string | null;
  planId: PaidPlanId;
  planName: string;
  status: SubscriptionStatus;
  activationKey: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string | null;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionSummary {
  planId: PaidPlanId;
  planName: string;
  status: SubscriptionStatus;
  activationKey: string;
  amount: number;
  currency: string;
  startsAt: string;
  expiresAt: string;
  customerEmail: string;
  customerName: string | null;
  isActive?: boolean;
}

export interface PaymentSummary {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
  razorpayPaymentId: string;
}

export interface LicenseValidationResult {
  valid: boolean;
  message?: string;
  user?: { name: string; email: string; imageUrl?: string | null };
  subscription?: SubscriptionSummary;
  payments?: PaymentSummary[];
}

export function computeExpiry(planId: PaidPlanId, from = new Date()): Date {
  const expires = new Date(from);
  if (planId === "monthly") {
    expires.setMonth(expires.getMonth() + 1);
  } else {
    expires.setFullYear(expires.getFullYear() + 1);
  }
  return expires;
}

export function isSubscriptionActive(sub: Pick<SubscriptionRecord, "status" | "expiresAt">): boolean {
  if (sub.status !== "active") return false;
  return new Date(sub.expiresAt).getTime() > Date.now();
}

export function formatMoney(amount: number, currency: string): string {
  const value = amount / 100;
  if (currency === "INR") return `₹${value.toLocaleString("en-IN")}`;
  if (currency === "USD") return `$${value.toLocaleString("en-US")}`;
  return `${value.toLocaleString()} ${currency}`;
}
