import { withDb } from "@/lib/auth/db";
import type { PaidPlanId } from "@/lib/payments/plans";
import type { PaymentRecord, SubscriptionRecord, SubscriptionStatus } from "@/lib/payments/types";

type PaymentRow = {
  id: string;
  subscription_id: string | null;
  user_id: string | null;
  plan_id: string;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  customer_email: string;
  customer_name: string | null;
  status: string;
  paid_at: Date;
  created_at: Date;
  activation_key?: string | null;
};

type SubscriptionRow = {
  id: string;
  user_id: string | null;
  payment_id: string | null;
  plan_id: string;
  plan_name: string;
  status: string;
  activation_key: string;
  amount: number;
  currency: string;
  customer_email: string;
  customer_name: string | null;
  starts_at: Date;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
};

function rowToPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    userId: row.user_id,
    planId: row.plan_id as PaidPlanId,
    amount: row.amount,
    currency: row.currency,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    status: row.status,
    paidAt: row.paid_at.toISOString(),
    createdAt: row.created_at.toISOString(),
  };
}

function rowToSubscription(row: SubscriptionRow): SubscriptionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    paymentId: row.payment_id,
    planId: row.plan_id as PaidPlanId,
    planName: row.plan_name,
    status: row.status as SubscriptionStatus,
    activationKey: row.activation_key,
    amount: row.amount,
    currency: row.currency,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    startsAt: row.starts_at.toISOString(),
    expiresAt: row.expires_at.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findPaymentByRazorpayPaymentId(
  paymentId: string,
): Promise<(PaymentRecord & { activationKey?: string | null }) | null> {
  return withDb(async (client) => {
    const { rows } = await client.query<PaymentRow>(
      `SELECT p.*, s.activation_key
       FROM vt_payments p
       LEFT JOIN vt_subscriptions s ON s.id = p.subscription_id
       WHERE p.razorpay_payment_id = $1
       LIMIT 1`,
      [paymentId],
    );
    if (!rows[0]) return null;
    const payment = rowToPayment(rows[0]);
    return { ...payment, activationKey: rows[0].activation_key };
  });
}

export async function insertPayment(payment: Omit<PaymentRecord, "createdAt">): Promise<PaymentRecord> {
  return withDb(async (client) => {
    const { rows } = await client.query<PaymentRow>(
      `INSERT INTO vt_payments (
         id, subscription_id, user_id, plan_id, amount, currency,
         razorpay_order_id, razorpay_payment_id, customer_email, customer_name,
         status, paid_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        payment.id,
        payment.subscriptionId,
        payment.userId,
        payment.planId,
        payment.amount,
        payment.currency,
        payment.razorpayOrderId,
        payment.razorpayPaymentId,
        payment.customerEmail,
        payment.customerName,
        payment.status,
        payment.paidAt,
      ],
    );
    return rowToPayment(rows[0]!);
  });
}

export async function linkPaymentToSubscription(
  paymentId: string,
  subscriptionId: string,
  _activationKey: string,
): Promise<void> {
  await withDb(async (client) => {
    await client.query(`UPDATE vt_payments SET subscription_id = $2 WHERE id = $1`, [
      paymentId,
      subscriptionId,
    ]);
  });
}

export async function insertSubscription(
  sub: Omit<SubscriptionRecord, "createdAt" | "updatedAt">,
): Promise<SubscriptionRecord> {
  return withDb(async (client) => {
    const { rows } = await client.query<SubscriptionRow>(
      `INSERT INTO vt_subscriptions (
         id, user_id, payment_id, plan_id, plan_name, status, activation_key,
         amount, currency, customer_email, customer_name, starts_at, expires_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        sub.id,
        sub.userId,
        sub.paymentId,
        sub.planId,
        sub.planName,
        sub.status,
        sub.activationKey,
        sub.amount,
        sub.currency,
        sub.customerEmail,
        sub.customerName,
        sub.startsAt,
        sub.expiresAt,
      ],
    );
    return rowToSubscription(rows[0]!);
  });
}

export async function findSubscriptionByActivationKey(
  activationKey: string,
): Promise<SubscriptionRecord | null> {
  return withDb(async (client) => {
    const { rows } = await client.query<SubscriptionRow>(
      `SELECT * FROM vt_subscriptions WHERE activation_key = $1 LIMIT 1`,
      [activationKey],
    );
    return rows[0] ? rowToSubscription(rows[0]) : null;
  });
}

export async function cancelActiveSubscriptionsForUser(userId: string): Promise<void> {
  await withDb(async (client) => {
    await client.query(
      `UPDATE vt_subscriptions SET status = 'cancelled', updated_at = NOW()
       WHERE user_id = $1 AND status = 'active'`,
      [userId],
    );
  });
}

export async function cancelActiveSubscriptionsForEmail(email: string): Promise<void> {
  await withDb(async (client) => {
    await client.query(
      `UPDATE vt_subscriptions SET status = 'cancelled', updated_at = NOW()
       WHERE LOWER(customer_email) = LOWER($1) AND status = 'active'`,
      [email],
    );
  });
}

export async function findLatestSubscriptionForUser(
  userId: string,
  email: string,
): Promise<SubscriptionRecord | null> {
  return withDb(async (client) => {
    const { rows } = await client.query<SubscriptionRow>(
      `SELECT * FROM vt_subscriptions
       WHERE user_id = $1 OR LOWER(customer_email) = LOWER($2)
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, email],
    );
    return rows[0] ? rowToSubscription(rows[0]) : null;
  });
}

export async function findPaymentsForUser(userId: string, email: string): Promise<PaymentRecord[]> {
  return withDb(async (client) => {
    const { rows } = await client.query<PaymentRow>(
      `SELECT * FROM vt_payments
       WHERE user_id = $1 OR LOWER(customer_email) = LOWER($2)
       ORDER BY paid_at DESC`,
      [userId, email],
    );
    return rows.map(rowToPayment);
  });
}

export async function deleteSubscriptionsForUser(userId: string, email: string): Promise<void> {
  await withDb(async (client) => {
    await client.query(
      `DELETE FROM vt_payments WHERE user_id = $1 OR LOWER(customer_email) = LOWER($2)`,
      [userId, email],
    );
    await client.query(
      `DELETE FROM vt_subscriptions WHERE user_id = $1 OR LOWER(customer_email) = LOWER($2)`,
      [userId, email],
    );
  });
}
