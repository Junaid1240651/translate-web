export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { handleRouteError, parseJsonBody } from "@/lib/auth/http";
import { validateLicenseKey } from "@/lib/payments/subscription-service";

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ key?: string }>(req);
    const key = body.key?.trim();

    if (!key) {
      return NextResponse.json(
        { valid: false, message: "Product key is required" },
        { status: 400 },
      );
    }

    const result = await validateLicenseKey(key);
    return NextResponse.json(result, { status: result.valid ? 200 : 401 });
  } catch (error) {
    return handleRouteError(error);
  }
}
