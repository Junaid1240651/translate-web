import { v4 as uuidv4 } from "uuid";
import { findUserByEmail, findUserById } from "@/lib/auth/repository";
import { randomAvatarUrl } from "@/lib/auth/avatar";
import { sendMail } from "@/lib/auth/mail";
import { subscriptionConfirmationEmail } from "@/lib/auth/email-templates";
import { generateActivationKey, formatActivationKey } from "@/lib/payments/activation-key";
import {
  findPaymentByRazorpayPaymentId,
  findSubscriptionByActivationKey,
  insertPayment,
  insertSubscription,
  findLatestSubscriptionForUser,
  findPaymentsForUser,
  linkPaymentToSubscription,
} from "@/lib/payments/subscription-repository";
import { fetchRazorpayOrder, fetchRazorpayPayment } from "@/lib/payments/razorpay";
import { getPaidPlan, type PaidPlanId } from "@/lib/payments/plans";
import {
  computeExpiry,
  formatMoney,
  isSubscriptionActive,
  type LicenseValidationResult,
  type SubscriptionRecord,
  type SubscriptionSummary,
} from "@/lib/payments/types";
import { normalizeActivationKey } from "@/lib/payments/activation-key";

function toSummary(sub: SubscriptionRecord): SubscriptionSummary {
  return {
    planId: sub.planId,
    planName: sub.planName,
    status: sub.status,
    activationKey: sub.activationKey,
    amount: sub.amount,
    currency: sub.currency,
    startsAt: sub.startsAt,
    expiresAt: sub.expiresAt,
    customerEmail: sub.customerEmail,
    customerName: sub.customerName,
  };
}

export async function getActiveSubscriptionForCustomer(
  userId: string | null,
  email: string,
): Promise<SubscriptionRecord | null> {
  const sub = await findLatestSubscriptionForUser(userId ?? "", email);
  if (!sub || !isSubscriptionActive(sub)) return null;
  return sub;
}

export async function assertCanPurchase(userId: string | null, email: string): Promise<void> {
  const active = await getActiveSubscriptionForCustomer(userId, email);
  if (active) {
    throw Object.assign(
      new Error("You already have an active subscription. Manage it from your account page."),
      { status: 409 },
    );
  }
}
export async function fulfillVerifiedPayment(
  orderId: string,
  paymentId: string,
  hints?: { customerEmail?: string; customerName?: string },
): Promise<{
  subscription: SubscriptionSummary;
  activationKey: string;
  alreadyFulfilled: boolean;
  emailSent: boolean;
}> {
  const existing = await findPaymentByRazorpayPaymentId(paymentId);
  if (existing?.subscriptionId) {
    const sub = await findSubscriptionByActivationKey(existing.activationKey ?? "");
    if (sub) {
      return {
        subscription: { ...toSummary(sub), isActive: isSubscriptionActive(sub) },
        activationKey: sub.activationKey,
        alreadyFulfilled: true,
        emailSent: false,
      };
    }
  }

  const order = await fetchRazorpayOrder(orderId);
  const payment = await fetchRazorpayPayment(paymentId);

  const planId = String(order.notes?.plan_id || "").trim() as PaidPlanId;
  const plan = getPaidPlan(planId);
  if (!plan) {
    throw Object.assign(new Error("Invalid plan on payment order"), { status: 400 });
  }

  const notesUserId = String(order.notes?.user_id || "").trim();
  const notesEmail = String(order.notes?.user_email || "").trim().toLowerCase();
  const hintEmail = hints?.customerEmail?.trim().toLowerCase() || "";
  const paymentEmail = String(
    payment.email || hintEmail || notesEmail || "",
  )
    .trim()
    .toLowerCase();
  const customerName =
    hints?.customerName?.trim() ||
    String(payment.notes?.customer_name || "").trim() ||
    String(order.notes?.user_name || "").trim() ||
    null;

  if (!paymentEmail) {
    throw Object.assign(new Error("Could not determine customer email for subscription"), {
      status: 400,
    });
  }

  let userId: string | null = notesUserId || null;
  if (userId) {
    const user = await findUserById(userId);
    if (!user) userId = null;
  }
  if (!userId) {
    const user = await findUserByEmail(paymentEmail);
    userId = user?.id ?? null;
  }

  await assertCanPurchase(userId, paymentEmail);

  const activationKey = formatActivationKey(generateActivationKey());
  const startsAt = new Date();
  const expiresAt = computeExpiry(planId, startsAt);

  const paymentRecord = await insertPayment({
    id: uuidv4(),
    subscriptionId: null,
    userId,
    planId,
    amount: Number(order.amount),
    currency: String(order.currency),
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    customerEmail: paymentEmail,
    customerName,
    status: "paid",
    paidAt: new Date(Number(payment.created_at) * 1000 || Date.now()).toISOString(),
  });

  const subscription = await insertSubscription({
    id: uuidv4(),
    userId,
    paymentId: paymentRecord.id,
    planId,
    planName: plan.name,
    status: "active",
    activationKey,
    amount: Number(order.amount),
    currency: String(order.currency),
    customerEmail: paymentEmail,
    customerName,
    startsAt: startsAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });

  await linkPaymentToSubscription(paymentRecord.id, subscription.id, activationKey);

  const displayName = customerName || paymentEmail.split("@")[0] || "there";
  const email = subscriptionConfirmationEmail({
    name: displayName,
    planName: plan.name,
    planId,
    amountLabel: formatMoney(subscription.amount, subscription.currency),
    activationKey,
    startsAt: subscription.startsAt,
    expiresAt: subscription.expiresAt,
    orderId,
    paymentId,
  });

  let emailSent = false;
  try {
    await sendMail(paymentEmail, email.subject, email.html, email.text);
    emailSent = true;
  } catch (err) {
    console.error("[subscription email failed]", paymentEmail, err);
  }

  const alertTo =
    process.env.CONTACT_ALERT_EMAIL?.trim() || process.env.SMTP_USER?.trim();
  if (alertTo && alertTo.toLowerCase() !== paymentEmail.toLowerCase()) {
    const adminCopy = subscriptionConfirmationEmail({
      name: displayName,
      planName: plan.name,
      planId,
      amountLabel: formatMoney(subscription.amount, subscription.currency),
      activationKey,
      startsAt: subscription.startsAt,
      expiresAt: subscription.expiresAt,
      orderId,
      paymentId,
      adminCopy: true,
      customerEmail: paymentEmail,
    });
    try {
      await sendMail(alertTo, `[New subscription] ${adminCopy.subject}`, adminCopy.html, adminCopy.text);
    } catch (err) {
      console.error("[subscription admin email failed]", alertTo, err);
    }
  }

  return {
    subscription: { ...toSummary(subscription), isActive: true },
    activationKey,
    alreadyFulfilled: false,
    emailSent,
  };
}

export async function validateLicenseKey(rawKey: string): Promise<LicenseValidationResult> {
  const normalized = normalizeActivationKey(rawKey);
  if (normalized.length !== 16) {
    return { valid: false, message: "Invalid product key format." };
  }

  const formatted = formatActivationKey(normalized);
  const subscription = await findSubscriptionByActivationKey(formatted);
  if (!subscription) {
    return {
      valid: false,
      message: "Invalid product key. Check your email or purchase receipt.",
    };
  }

  if (!isSubscriptionActive(subscription)) {
    return {
      valid: false,
      message: "Your subscription has expired. Renew at videotranslator.app/pricing to continue.",
    };
  }

  let userName = subscription.customerName;
  let userEmail = subscription.customerEmail;
  let imageUrl: string | null = null;

  let accountUser = subscription.userId
    ? await findUserById(subscription.userId)
    : null;
  if (!accountUser && subscription.customerEmail) {
    accountUser = await findUserByEmail(subscription.customerEmail);
  }
  if (accountUser) {
    userName = accountUser.name;
    userEmail = accountUser.email;
    imageUrl = accountUser.imageUrl;
  }

  if (!imageUrl?.startsWith("http")) {
    imageUrl = randomAvatarUrl(userEmail || userName || formatted);
  }

  const payments = await findPaymentsForUser(subscription.userId ?? "", subscription.customerEmail);

  return {
    valid: true,
    user: {
      name: userName || userEmail.split("@")[0] || "User",
      email: userEmail,
      imageUrl,
    },
    subscription: { ...toSummary(subscription), isActive: true },
    payments: payments.map((p) => ({
      id: p.id,
      planId: p.planId,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paidAt: p.paidAt,
      razorpayPaymentId: p.razorpayPaymentId,
    })),
  };
}

export async function getAccountSubscription(userId: string, email: string) {
  const subscription = await findLatestSubscriptionForUser(userId, email);
  const payments = await findPaymentsForUser(userId, email);
  return {
    subscription: subscription
      ? {
          ...toSummary(subscription),
          isActive: isSubscriptionActive(subscription),
        }
      : null,
    payments: payments.map((p) => ({
      id: p.id,
      planId: p.planId,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paidAt: p.paidAt,
      razorpayPaymentId: p.razorpayPaymentId,
    })),
  };
}
