import { NextResponse } from "next/server";
import { cashfreeConfigured } from "@/lib/cashfree-server";
import { d1Configured } from "@/lib/d1";
import { piiConfigured } from "@/lib/pii";
import { cancelAndRefund, findBookingForGuest, previewCancellation } from "@/lib/cancellations";
import { getRoom } from "@/lib/rooms";

const NOT_FOUND = { ok: false, error: "We couldn't find a booking with that ID and mobile number. Please check both and try again." };

/**
 * Guest cancellation. The guest proves it is their booking with the booking ID AND the mobile number used.
 *   action "preview": shows what they would be refunded today (nothing changes).
 *   action "confirm": cancels the booking and sends the refund.
 * The refund percentage is always worked out here from the dates; the browser can't choose it.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { ref?: string; phone?: string; action?: string } | null;
  const ref = body?.ref?.trim().toUpperCase() ?? "";
  const phone = body?.phone?.replace(/\D/g, "") ?? "";
  if (!body || (body.action !== "preview" && body.action !== "confirm")) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  if (!cashfreeConfigured() || !d1Configured() || !piiConfigured()) {
    return NextResponse.json({ ok: false, error: "Online cancellation is not available right now. Please call us." }, { status: 503 });
  }

  try {
    if (body.action === "preview") {
      const b = await findBookingForGuest(ref, phone);
      if (!b) return NextResponse.json(NOT_FOUND, { status: 404 });
      const p = previewCancellation(b);
      return NextResponse.json({ ok: true, ...p, roomName: getRoom(p.room)?.name.replace(/[[\]]/g, "") ?? p.room, ref });
    }

    const r = await cancelAndRefund(ref, phone);
    if (!r.ok) {
      if (r.reason === "not_found") return NextResponse.json(NOT_FOUND, { status: 404 });
      if (r.reason === "started") return NextResponse.json({ ok: false, error: "This stay has already started, so it can't be cancelled online. Please call us." }, { status: 409 });
      return NextResponse.json({ ok: false, error: "This booking can't be cancelled online. Please call us." }, { status: 409 });
    }
    return NextResponse.json(r);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again, or call us." }, { status: 502 });
  }
}
