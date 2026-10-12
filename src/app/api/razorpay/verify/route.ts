import { NextResponse } from "next/server";
import { razorpayConfigured, verifySignature } from "@/lib/razorpay-server";

/**
 * Called by the browser after Razorpay reports a successful payment.
 * Only a valid signature confirms the booking.
 *
 * For production, ALSO listen to Razorpay's `payment.captured` webhook so a
 * booking is confirmed even if the guest closes the tab before this call.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    ref?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  } | null;

  if (!body?.ref || !body.razorpay_order_id || !body.razorpay_payment_id) {
    return NextResponse.json({ ok: false, error: "Missing payment details." }, { status: 400 });
  }

  if (!razorpayConfigured()) {
    // Mock mode (no keys set): accept only the mock order created for this ref.
    const ok = body.razorpay_order_id === `order_mock_${body.ref}`;
    return NextResponse.json({ ok, mode: "mock" }, { status: ok ? 200 : 400 });
  }

  const ok = verifySignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature ?? "");
  if (!ok) return NextResponse.json({ ok: false, error: "Payment could not be verified." }, { status: 400 });

  // TODO(backend): save the booking (ref, order id, payment id, guest, dates),
  // block the room for those dates, and send WhatsApp + email confirmations.

  return NextResponse.json({ ok: true, mode: "live" });
}
