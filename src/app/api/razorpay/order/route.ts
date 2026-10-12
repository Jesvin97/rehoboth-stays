import { NextResponse } from "next/server";
import { quote } from "@/lib/pricing";
import { getRoom } from "@/lib/rooms";
import { todayIST } from "@/lib/dates";
import { bookingRef, isCheckoutRequest } from "@/lib/booking-schema";
import { createOrder, razorpayConfigured } from "@/lib/razorpay-server";

/**
 * Creates a Razorpay order for the FULL amount of the stay.
 * The price is recalculated here — the amount shown in the browser is never trusted.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!isCheckoutRequest(body)) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  if (body.checkIn < todayIST()) {
    return NextResponse.json({ error: "Check-in can't be in the past." }, { status: 400 });
  }

  const q = quote({
    roomSlug: body.room,
    plan: body.plan,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    adults: body.adults,
    children: body.children,
    addOns: body.addOns,
    coupon: body.coupon,
  });
  if (!q.ok) return NextResponse.json({ error: q.error }, { status: 400 });

  // TODO(backend): check live availability for these dates before taking payment.

  const ref = bookingRef();
  const room = getRoom(body.room)!;

  if (!razorpayConfigured()) {
    return NextResponse.json({ mode: "mock", ref, orderId: `order_mock_${ref}`, amount: q.total, currency: "INR" });
  }

  try {
    const order = await createOrder({
      amountRupees: q.total,
      receipt: ref,
      notes: {
        booking_ref: ref,
        room: room.name,
        check_in: body.checkIn,
        check_out: body.checkOut,
        guests: `${body.adults}A ${body.children}C`,
        guest_phone: body.guest.phone,
      },
    });
    return NextResponse.json({
      mode: "live",
      ref,
      orderId: order.id,
      amount: q.total,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "We couldn't start the payment. Please try again in a moment." }, { status: 502 });
  }
}
