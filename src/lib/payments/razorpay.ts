import crypto from "crypto";
import Razorpay from "razorpay";
import { getPaidPlan, type PaidPlanId } from "@/lib/payments/plans";

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw Object.assign(new Error("Payment gateway is not configured"), { status: 503 });
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function getRazorpayKeyId() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  if (!keyId) {
    throw Object.assign(new Error("Payment gateway is not configured"), { status: 503 });
  }
  return keyId;
}

export async function createPaymentOrder(planId: PaidPlanId, user?: { id: string; email: string; name: string }) {
  const plan = getPaidPlan(planId);
  if (!plan) {
    throw Object.assign(new Error("Invalid plan selected"), { status: 400 });
  }

  const client = getRazorpayClient();
  const receipt = `vt_${planId}_${Date.now()}`;

  const order = await client.orders.create({
    amount: plan.amount,
    currency: plan.currency,
    receipt,
    notes: {
      plan_id: planId,
      plan_name: plan.name,
      user_id: user?.id ?? "",
      user_email: user?.email ?? "",
      user_name: user?.name ?? "",
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    planId,
    planName: plan.name,
    keyId: getRazorpayKeyId(),
    prefill: user
      ? { name: user.name, email: user.email }
      : undefined,
  };
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keySecret) return false;

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
}

export async function fetchRazorpayOrder(orderId: string) {
  const client = getRazorpayClient();
  return client.orders.fetch(orderId);
}

export async function fetchRazorpayPayment(paymentId: string) {
  const client = getRazorpayClient();
  return client.payments.fetch(paymentId);
}
