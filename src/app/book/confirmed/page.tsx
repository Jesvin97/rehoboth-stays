import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutHeader } from "@/components/book/CheckoutHeader";
import { Photo } from "@/components/ui/Photo";
import { getRoom, plans } from "@/lib/rooms";
import { inr } from "@/lib/pricing";
import { formatShort, parseISO } from "@/lib/dates";
import { cancellationSchedule } from "@/lib/cancellation";
import { site } from "@/lib/site";
import type { SearchParams } from "@/lib/booking-params";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * Confirmation screen. Details come from the URL for now.
 * TODO(backend): load the saved booking by `ref` instead of trusting the query string.
 */
export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const room = getRoom(one(sp.room));
  const ref = one(sp.ref);
  if (!room || !ref) redirect("/");

  const checkIn = one(sp.in);
  const checkOut = one(sp.out);
  const adults = Number(one(sp.adults)) || 1;
  const children = Number(one(sp.children)) || 0;
  const total = Number(one(sp.total)) || 0;
  const plan = plans.find((p) => p.id === one(sp.plan)) ?? plans[0];
  const booked = parseISO(one(sp.booked)) ? one(sp.booked) : checkIn;
  const policy = cancellationSchedule(booked);
  const guests = `${adults} ${adults === 1 ? "adult" : "adults"}${children ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}`;
  const firstName = one(sp.name) || "friend";
  const phone = one(sp.phone);

  return (
    <>
      <CheckoutHeader />
      <main id="main" className="bg-paper">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 px-4 pb-24 pt-14 text-center sm:px-6">
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-accent text-white">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <h1 className="font-display text-[clamp(34px,5vw,44px)] font-medium leading-[1.05]">See you soon, {firstName}!</h1>
          <p className="max-w-[520px] text-lg text-ink-soft">
            Your stay is confirmed and paid in full. Details and directions are on their way{phone ? ` to +91 ${phone}` : ""} on WhatsApp.
          </p>

          <div className="card w-full gap-3 text-left">
            <div className="flex items-center gap-3.5 border-b border-line-soft pb-3.5">
              <Photo label={room.photos[0].label} src={room.photos[0].src} tone={room.photos[0].tone} className="h-[72px] w-24 shrink-0 rounded-[3px] text-[10px] [&>div]:p-2" />
              <div>
                <strong className="text-lg">{room.name}</strong>
                <div className="text-sm text-muted">{plan.name} · Booking ID {ref}</div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-[15px] sm:grid-cols-4">
              <div><dt className="text-[13px] text-muted">Check-in</dt><dd className="font-semibold">{formatShort(checkIn)}</dd><dd className="text-[13px] text-muted">from {site.checkInTime}</dd></div>
              <div><dt className="text-[13px] text-muted">Check-out</dt><dd className="font-semibold">{formatShort(checkOut)}</dd><dd className="text-[13px] text-muted">by {site.checkOutTime}</dd></div>
              <div><dt className="text-[13px] text-muted">Guests</dt><dd className="font-semibold">{guests}</dd></div>
              <div><dt className="text-[13px] text-muted">Paid in full</dt><dd className="font-semibold">{inr(total)}</dd><dd className="break-all text-[13px] text-muted">{one(sp.pay)}</dd></div>
            </dl>
            <p className="border-t border-line-soft pt-3 text-sm text-muted">
              Need to cancel? 50% refund until {formatShort(policy.fiftyUntil)}, 25% until {formatShort(policy.quarterUntil)}, no refund from {formatShort(policy.noRefundFrom)}.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            <a href={site.social.maps} className="btn-primary no-underline">Get directions</a>
            <a href={`tel:${site.phoneHref.replace("tel:", "")}`} className="btn-outline no-underline">Call your host</a>
          </div>
          <Link href="/" className="font-semibold">Back to home</Link>
        </div>
      </main>
    </>
  );
}
