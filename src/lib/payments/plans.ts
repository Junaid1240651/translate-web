export type PaidPlanId = "monthly" | "yearly";

export interface PricingPlan {
  id: PaidPlanId | "custom";
  name: string;
  priceLabel: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  amount?: number;
  currency?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    priceLabel: "$200",
    period: "per month",
    description: "Full access to Video Translator with flexible monthly billing.",
    features: [
      "Unlimited YouTube dubbing",
      "Audiobook creator",
      "50+ languages",
      "Email support",
      "All app updates",
    ],
    cta: "Subscribe monthly",
    amount: 20000,
    currency: "INR",
  },
  {
    id: "yearly",
    name: "Yearly",
    priceLabel: "$2,000",
    period: "per year",
    description: "Best value for power users and teams who dub regularly.",
    features: [
      "Everything in Monthly",
      "Priority email support",
      "Early access to new features",
      "Save vs monthly billing",
      "Dedicated onboarding",
    ],
    highlighted: true,
    badge: "Best value",
    cta: "Subscribe yearly",
    amount: 200000,
    currency: "INR",
  },
  {
    id: "custom",
    name: "Custom",
    priceLabel: "Let's talk",
    period: "tailored pricing",
    description: "Enterprise, volume licensing, or special requirements.",
    features: [
      "Custom seat count",
      "Volume discounts",
      "SLA & priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact us",
  },
];

export function getPaidPlan(planId: string) {
  return PRICING_PLANS.find(
    (plan): plan is PricingPlan & { id: PaidPlanId; amount: number; currency: string } =>
      (plan.id === "monthly" || plan.id === "yearly") && plan.id === planId,
  );
}
