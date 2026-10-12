import { NextResponse } from "next/server";

/**
 * Verifies the OTP. In dev mode (no OTP_PROVIDER_KEY) any 4 digits pass,
 * so the checkout can be demoed. Replace with the provider's verify call.
 */
export async function POST(req: Request) {
  const { phone, code } = ((await req.json().catch(() => ({}))) ?? {}) as { phone?: string; code?: string };
  if (!phone || !/^[6-9]\d{9}$/.test(phone) || !code || !/^\d{4}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "Enter the 4-digit code." }, { status: 400 });
  }
  if (!process.env.OTP_PROVIDER_KEY) return NextResponse.json({ ok: true, dev: true });
  return NextResponse.json({ ok: false, error: "OTP provider not connected yet." }, { status: 501 });
}
