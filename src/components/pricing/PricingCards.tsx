"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import AppModal from "@/components/ui/AppModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { PRICING_PLANS, type PaidPlanId } from "@/lib/payments/plans";
import { cn } from "@/lib/cn";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/payments/checkout-client";
import {
  fetchAccountSubscription,
  getAccessToken,
  type AccountSubscription,
} from "@/lib/auth-client";
import { formatMoney } from "@/lib/payments/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PricingCards() {
  const [loadingPlan, setLoadingPlan] = useState<PaidPlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successPlan, setSuccessPlan] = useState("");
  const [activationKey, setActivationKey] = useState("");
  const [activeSubscription, setActiveSubscription] = useState<AccountSubscription | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);

  useEffect(() => {
    const loadBilling = async () => {
      if (!getAccessToken()) {
        setBillingLoading(false);
        return;
      }
      try {
        const billing = await fetchAccountSubscription();
        if (billing.subscription?.isActive) {
          setActiveSubscription(billing.subscription);
        }
      } catch {
        setActiveSubscription(null);
      } finally {
        setBillingLoading(false);
      }
    };
    loadBilling();
  }, []);

  const handleSubscribe = useCallback(async (planId: PaidPlanId) => {
    if (activeSubscription) return;

    setLoadingPlan(planId);
    setError(null);

    try {
      await loadRazorpayScript();

      const token = getAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers,
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to start checkout");
      }

      await openRazorpayCheckout({
        key: data.keyId,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        planName: data.planName,
        prefill: data.prefill,
        onSuccess: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers,
            body: JSON.stringify({
              ...response,
              customerEmail: data.prefill?.email,
              customerName: data.prefill?.name,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyData.message || "Payment verification failed");
          }
          setSuccessPlan(data.planName);
          setActivationKey(verifyData.activationKey || "");
          if (verifyData.subscription) {
            setActiveSubscription(verifyData.subscription);
          }
          setSuccessOpen(true);
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment could not be completed";
      if (message !== "Checkout closed") {
        setError(message);
      }
    } finally {
      setLoadingPlan(null);
    }
  }, [activeSubscription]);

  const hasActivePlan = Boolean(activeSubscription?.isActive);

  return (
    <>
      {loadingPlan ? (
        <LoadingScreen variant="overlay" message="Opening secure checkout…" />
      ) : null}

      <AppModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Payment successful!"
        description={
          activationKey
            ? `Your ${successPlan} subscription is active. We emailed your activation key to you — you can also use it here: ${activationKey}`
            : `Your ${successPlan} subscription is active. Check your email for your activation key.`
        }
        icon={<Check className="h-7 w-7" />}
        iconClassName="bg-success/15 text-success"
        actions={[
          { label: "Back to home", href: "/", variant: "primary" },
          { label: "My account", href: "/account", variant: "secondary" },
        ]}
      />

      {error ? (
        <div
          className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {hasActivePlan && activeSubscription ? (
        <div
          className="mb-8 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground"
          role="status"
        >
          <p className="font-semibold text-primary">
            You already have an active {activeSubscription.planName} subscription
          </p>
          <p className="mt-1 text-muted-foreground">
            Valid until {formatDate(activeSubscription.expiresAt)} ·{" "}
            {formatMoney(activeSubscription.amount, activeSubscription.currency)}
          </p>
          <Link
            href="/account"
            className="mt-3 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            View activation key & payment history
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      {!billingLoading && !getAccessToken() ? (
        <div className="mb-8 rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>{" "}
          before subscribing so your plan and activation key are saved to your account.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {PRICING_PLANS.map((plan) => {
          const isCustom = plan.id === "custom";
          const Icon = plan.highlighted ? Crown : isCustom ? MessageSquare : Zap;
          const subscribeDisabled = hasActivePlan || loadingPlan !== null || billingLoading;

          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 sm:p-8",
                plan.highlighted
                  ? "border-primary/50 bg-gradient-to-b from-primary/10 via-card/60 to-card/40 shadow-glow"
                  : "border-border/60 bg-card/40",
              )}
            >
              {plan.badge ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </span>
              ) : null}

              <div className="mb-6 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    plan.highlighted ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="text-xs text-muted-foreground">{plan.period}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-4xl font-bold tracking-tight">{plan.priceLabel}</p>
                {!isCustom ? (
                  <p className="mt-1 text-sm text-muted-foreground">Billed in USD via Razorpay</p>
                ) : null}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isCustom ? (
                <Link
                  href="/contact?reason=general"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-card/80"
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={subscribeDisabled}
                  onClick={() => handleSubscribe(plan.id as PaidPlanId)}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                    plan.highlighted
                      ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary-hover"
                      : "border border-border hover:border-primary/40 hover:bg-card/80",
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  {hasActivePlan
                    ? activeSubscription?.planId === plan.id
                      ? "Current plan"
                      : "Already subscribed"
                    : plan.cta}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
