import { NextResponse } from "next/server";
import { cashfreeConfigured } from "@/lib/cashfree-server";
import { confirmPayment } from "@/lib/payments";

/**
 * Called by the browser after the Cashfree window closes. The browser's word is never
 * trusted: the server asks Cashfree whether the order is paid.
 * The Cashfree webhook (/api/pay/webhook) also confirms bookings, so a booking is
 * saved even if the guest closes the tab.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { ref?: string; mockOrderId?: string } | null;
  if (!body?.ref || !/^RS-[0-9A-Z]{6}$/.test(body.ref)) {
    return NextResponse.json({ ok: false, error: "Missing payment details." }, { status: 400 });
  }

  if (!cashfreeConfigured()) {
    // Demo mode (no keys): accept only the mock order created for this ref.
    const ok = body.mockOrderId === `order_mock_${body.ref}`;
    return NextResponse.json({ ok, mode: "mock" }, { status: ok ? 200 : 400 });
  }

  const result = await confirmPayment(body.ref).catch((err) => {
    console.error(err);
    return "failed" as const;
  });
  if (result === "paid") return NextResponse.json({ ok: true, mode: "live" });
  if (result === "pending") return NextResponse.json({ ok: false, pending: true, error: "Payment is not confirmed yet." }, { status: 202 });
  if (result === "needs_review") return NextResponse.json({ ok: false, error: "Payment received but the booking needs a quick check. We will contact you." }, { status: 409 });
  return NextResponse.json({ ok: false, error: "Payment could not be verified." }, { status: 400 });
}
