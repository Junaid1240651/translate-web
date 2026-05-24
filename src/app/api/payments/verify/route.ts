export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { handleRouteError, parseJsonBody } from "@/lib/auth/http";
import { getUserFromRequest } from "@/lib/auth/session";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { fulfillVerifiedPayment } from "@/lib/payments/subscription-service";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      customerEmail?: string;
      customerName?: string;
    }>(req);

    const orderId = body.razorpay_order_id?.trim();
    const paymentId = body.razorpay_payment_id?.trim();
    const signature = body.razorpay_signature?.trim();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ message: "Missing payment verification fields" }, { status: 400 });
    }

    const valid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!valid) {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    const user = await getUserFromRequest(req);
    const result = await fulfillVerifiedPayment(orderId, paymentId, {
      customerEmail: body.customerEmail?.trim() || user?.email,
      customerName: body.customerName?.trim() || user?.name,
    });

    return NextResponse.json({
      message: result.alreadyFulfilled
        ? "Payment already processed"
        : result.emailSent
          ? "Payment verified — check your email for your activation key"
          : "Payment verified — activation key is shown below and saved to your account",
      orderId,
      paymentId,
      activationKey: result.activationKey,
      subscription: result.subscription,
      emailSent: result.emailSent,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
