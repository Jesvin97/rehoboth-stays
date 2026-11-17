import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { d1Configured } from "@/lib/d1";
import { getBooking, logPaymentEvent, markPaid } from "@/lib/bookings";

/**
 * Razorpay webhook. In the Razorpay dashboard (Settings > Webhooks) add
 *   https://<your-site>/api/razorpay/webhook   with the `payment.captured` event
 * and put the secret you choose in RAZORPAY_WEBHOOK_SECRET.
 * This confirms the booking even if the guest closes the tab after paying.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !d1Configured()) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return NextResponse.json({ ok: false }, { status: 400 });

  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; notes?: { booking_ref?: string } } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (event.event !== "payment.captured") return NextResponse.json({ ok: true, ignored: true });

  const p = event.payload?.payment?.entity;
  const ref = p?.notes?.booking_ref ?? null;
  if (!p?.id || !p.order_id || !ref) return NextResponse.json({ ok: true, ignored: true });

  try {
    await logPaymentEvent({ ref, event: event.event, orderId: p.order_id, paymentId: p.id, amountPaise: p.amount ?? null, raw });
    const booking = await getBooking(ref);
    // Only confirm when the amount paid matches the total the server calculated.
    if (!booking || Math.round(booking.total * 100) !== p.amount) {
      console.error("Webhook amount mismatch for", ref);
      return NextResponse.json({ ok: true, flagged: true });
    }
    await markPaid(ref, p.order_id, p.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 }); // Razorpay retries
  }
}
