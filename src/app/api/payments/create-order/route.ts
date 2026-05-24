export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { handleRouteError, parseJsonBody } from "@/lib/auth/http";
import { getUserFromRequest } from "@/lib/auth/session";
import { createPaymentOrder } from "@/lib/payments/razorpay";
import { assertCanPurchase } from "@/lib/payments/subscription-service";
import type { PaidPlanId } from "@/lib/payments/plans";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ planId?: string }>(req);
    const planId = body.planId?.trim();

    if (planId !== "monthly" && planId !== "yearly") {
      return NextResponse.json({ message: "Invalid plan selected" }, { status: 400 });
    }

    const user = await getUserFromRequest(req);
    if (user) {
      await assertCanPurchase(user.id, user.email);
    }

    const order = await createPaymentOrder(planId as PaidPlanId, user ?? undefined);

    return NextResponse.json(order);
  } catch (error) {
    return handleRouteError(error);
  }
}
