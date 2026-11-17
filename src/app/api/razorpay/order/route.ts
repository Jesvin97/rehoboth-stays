import { NextResponse } from "next/server";
import { quote } from "@/lib/pricing";
import { getRoom } from "@/lib/rooms";
import { todayIST } from "@/lib/dates";
import { bookingRef, isCheckoutRequest } from "@/lib/booking-schema";
import { createOrder, razorpayConfigured } from "@/lib/razorpay-server";
import { d1Configured } from "@/lib/d1";
import { piiConfigured } from "@/lib/pii";
import { attachOrder, cancelBooking, createPendingBooking } from "@/lib/bookings";

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

  const ref = bookingRef();
  const room = getRoom(body.room)!;

  // Demo mode (no Razorpay keys): nothing is saved and no money moves.
  if (!razorpayConfigured()) {
    return NextResponse.json({ mode: "mock", ref, orderId: `order_mock_${ref}`, amount: q.total, currency: "INR" });
  }

  // Live payments must never run without the database, or a paid stay could go unrecorded.
  if (!d1Configured() || !piiConfigured()) {
    console.error("Razorpay is live but the database or PII_ENCRYPTION_KEY is not configured.");
    return NextResponse.json({ error: "Online booking is temporarily unavailable. Please call us to book." }, { status: 503 });
  }

  // Hold the dates (atomic availability check + insert) before taking payment.
  try {
    const held = await createPendingBooking(ref, body, q.total);
    if (!held) return NextResponse.json({ error: "Sorry, those dates were just taken. Please choose different dates." }, { status: 409 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "We couldn't reserve your dates. Please try again in a moment." }, { status: 502 });
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
      },
    });
    await attachOrder(ref, order.id);
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
    await cancelBooking(ref).catch(() => {});
    return NextResponse.json({ error: "We couldn't start the payment. Please try again in a moment." }, { status: 502 });
  }
}
