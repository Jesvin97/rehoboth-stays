import { NextResponse } from "next/server";

/**
 * Sends a login OTP to the guest's mobile.
 * TODO(backend): connect an SMS/WhatsApp OTP provider (e.g. MSG91, Twilio Verify,
 * Firebase Phone Auth) and set OTP_PROVIDER_KEY. Until then this runs in dev mode.
 */
export async function POST(req: Request) {
  const { phone } = ((await req.json().catch(() => ({}))) ?? {}) as { phone?: string };
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
  }
  const dev = !process.env.OTP_PROVIDER_KEY;
  return NextResponse.json({ ok: true, dev });
}
