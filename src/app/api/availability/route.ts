import { NextResponse } from "next/server";
import { d1Configured } from "@/lib/d1";
import { getBookedRanges, getUnavailableRooms } from "@/lib/bookings";
import { nightsBetween, parseISO, todayIST } from "@/lib/dates";
import { getRoom, rooms } from "@/lib/rooms";

/**
 * Public availability, with no guest details.
 *   /api/availability?in=YYYY-MM-DD&out=YYYY-MM-DD  -> rooms that are NOT free for those dates
 *   /api/availability?room=slug                     -> date ranges already booked for that room
 * Always read live from the database, so a cancellation shows up for the next visitor straight away.
 */
export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Without the database (demo mode) everything shows as free.
  if (!d1Configured()) return NextResponse.json({ unavailable: [], booked: [] }, { headers: NO_STORE });

  try {
    const room = url.searchParams.get("room");
    if (room) {
      if (!getRoom(room)) return NextResponse.json({ error: "Unknown room." }, { status: 400, headers: NO_STORE });
      return NextResponse.json({ booked: await getBookedRanges(room, todayIST()) }, { headers: NO_STORE });
    }

    const checkIn = url.searchParams.get("in") ?? "";
    const checkOut = url.searchParams.get("out") ?? "";
    if (!parseISO(checkIn) || !parseISO(checkOut) || nightsBetween(checkIn, checkOut) < 1 || nightsBetween(checkIn, checkOut) > 60 || checkOut <= todayIST()) {
      return NextResponse.json({ error: "Invalid dates." }, { status: 400, headers: NO_STORE });
    }
    const unavailable = await getUnavailableRooms(checkIn, checkOut, rooms.map((r) => r.slug));
    return NextResponse.json({ unavailable }, { headers: NO_STORE });
  } catch (err) {
    console.error(err);
    // If we can't tell, don't block anyone: the booking itself is checked again before payment.
    return NextResponse.json({ unavailable: [], booked: [], unknown: true }, { headers: NO_STORE });
  }
}
