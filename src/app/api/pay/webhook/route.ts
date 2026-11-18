import { NextResponse } from "next/server";
import { cashfreeConfigured, verifyWebhookSignature } from "@/lib/cashfree-server";
import { d1Configured } from "@/lib/d1";
import { confirmPayment } from "@/lib/payments";
import { processRefund } from "@/lib/cancellations";

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

  let event: { type?: string; data?: { order?: { order_id?: string }; refund?: { order_id?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Refund status updates: read the real status from Cashfree again rather than trusting the body.
  if (event.type === "REFUND_STATUS_WEBHOOK") {
    const refundRef = event.data?.refund?.order_id ?? event.data?.order?.order_id;
    if (refundRef && /^RS-[0-9A-Z]{6}$/.test(refundRef)) {
      try {
        await processRefund(refundRef);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true });
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
