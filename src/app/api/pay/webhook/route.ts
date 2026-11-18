import { NextResponse } from "next/server";
import { cashfreeConfigured, verifyWebhookSignature } from "@/lib/cashfree-server";
import { d1Configured } from "@/lib/d1";
import { confirmPayment } from "@/lib/payments";

/**
 * Cashfree webhook. In the Cashfree dashboard (Developers > Webhooks) add
 *   https://<your-site>/api/pay/webhook   for the payment success event.
 * Cashfree signs each call with your secret key. This confirms the booking even if
 * the guest closes the tab after paying. The booking is confirmed by asking Cashfree
 * for the order status, not by trusting the webhook body.
 */
export async function POST(req: Request) {
  if (!cashfreeConfigured() || !d1Configured()) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text();
  const ok = verifyWebhookSignature(raw, req.headers.get("x-webhook-signature") ?? "", req.headers.get("x-webhook-timestamp") ?? "");
  if (!ok) return NextResponse.json({ ok: false }, { status: 400 });

  let event: { type?: string; data?: { order?: { order_id?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ref = event.data?.order?.order_id;
  if (event.type !== "PAYMENT_SUCCESS_WEBHOOK" || !ref || !/^RS-[0-9A-Z]{6}$/.test(ref)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    await confirmPayment(ref);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 }); // Cashfree retries
  }
}
