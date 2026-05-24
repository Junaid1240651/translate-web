import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message, detail: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof Error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    if (status >= 500) {
      console.error("[auth]", error);
    }
    return jsonError(error.message, status);
  }
  console.error("[auth]", error);
  return jsonError("Something went wrong", 500);
}

export async function parseJsonBody<T extends Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw Object.assign(new Error("Invalid JSON body"), { status: 400 });
  }
}
