export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/auth/http";
import { getUserFromRequest } from "@/lib/auth/session";
import { getAccountSubscription } from "@/lib/payments/subscription-service";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await getAccountSubscription(user.id, user.email);
    return NextResponse.json(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
