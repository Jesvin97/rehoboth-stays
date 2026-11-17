import { NextResponse } from "next/server";
import { razorpayConfigured, verifySignature } from "@/lib/razorpay-server";
import { d1Configured } from "@/lib/d1";
import { markPaid } from "@/lib/bookings";

/**
 * Called by the browser after Razorpay reports a successful payment.
 * Only a valid signature confirms the booking.
 *
 * The `payment.captured` webhook (/api/razorpay/webhook) also confirms the booking,
 * so it is saved even if the guest closes the tab before this call.
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

  if (!d1Configured()) return NextResponse.json({ ok: false, error: "Booking could not be saved." }, { status: 503 });
  const result = await markPaid(body.ref, body.razorpay_order_id, body.razorpay_payment_id).catch((err) => {
    console.error(err);
    return null;
  });
  if (result !== "paid") {
    // The webhook will retry the save; "needs_review" means the dates were lost during payment and the host must step in.
    return NextResponse.json({ ok: false, error: "Payment received but the booking needs a quick check. We will contact you." }, { status: 409 });
  }

  return NextResponse.json({ ok: true, mode: "live" });
}
