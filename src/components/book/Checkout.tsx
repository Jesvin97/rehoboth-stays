"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { plans, type Room } from "@/lib/rooms";
import { addOns, inr, quote } from "@/lib/pricing";
import { addDays, formatShort, nightsBetween, todayIST } from "@/lib/dates";
import { cancellationSchedule } from "@/lib/cancellation";
import { houseRules } from "@/lib/content";
import { site } from "@/lib/site";
import type { BookingSelection } from "@/lib/booking-params";
import type { CheckoutRequest } from "@/lib/booking-schema";
import { loadRazorpay, openRazorpay, type RazorpaySuccess } from "@/lib/razorpay-client";
import { Stepper } from "../ui/Stepper";
import { ChevronLeft, Lock } from "../ui/Icons";
import { PriceSummary } from "./PriceSummary";
import { MockGateway } from "./MockGateway";

const REQUESTS = ["Early check-in", "Late check-out", "Celebrating something", "Vegetarian meals", "Airport pickup", "Ground-floor room"];

type OrderResponse =
  | { mode: "mock"; ref: string; orderId: string; amount: number }
  | { mode: "live"; ref: string; orderId: string; amount: number; currency: string; keyId: string };

export function Checkout({ room, initial }: { room: Room; initial: BookingSelection }) {
  const router = useRouter();
  const today = todayIST();

  // Trip
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [adults, setAdults] = useState(Math.min(initial.adults, room.maxAdults));
  const [children, setChildren] = useState(Math.min(initial.children, room.maxChildren));
  const [editDates, setEditDates] = useState(false);
  const [editGuests, setEditGuests] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);

  // Guest
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDev, setOtpDev] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [bookingFor, setBookingFor] = useState<"self" | "other">("self");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otherName, setOtherName] = useState("");
  const [otherPhone, setOtherPhone] = useState("");
  const [gst, setGst] = useState(false);
  const [gstin, setGstin] = useState("");
  const [company, setCompany] = useState("");
  const [requests, setRequests] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // Agree + pay
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [mock, setMock] = useState<OrderResponse | null>(null);

  const digits = phone.replace(/\D/g, "").slice(-10);
  const plan = plans.find((p) => p.id === initial.plan)!;
  const q = useMemo(() => {
    const r = quote({ roomSlug: room.slug, plan: initial.plan, checkIn, checkOut, adults, children, addOns: initial.addOns, coupon });
    return r.ok ? r : null;
  }, [room.slug, initial.plan, initial.addOns, checkIn, checkOut, adults, children, coupon]);
  const datesValid = nightsBetween(checkIn, checkOut) >= 1 && checkIn >= today;
  const policy = cancellationSchedule(today);
  const guestLabel = `${adults} ${adults === 1 ? "adult" : "adults"}${children ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}`;

  const missing: string[] = [];
  if (!datesValid || !q) missing.push("valid dates");
  if (!verified) missing.push("mobile verification");
  if (name.trim().length < 2) missing.push("your name");
  if (bookingFor === "other" && otherName.trim().length < 2) missing.push("the guest's name");
  if (!agree) missing.push("agreeing to the house rules");

  const steps = [
    { label: "Your trip", ok: datesValid && !!q },
    { label: "Guest details", ok: verified && name.trim().length >= 2 },
    { label: "Payment", ok: agree },
  ];

  async function sendOtp() {
    setOtpError("");
    if (!/^[6-9]\d{9}$/.test(digits)) return setOtpError("Enter a valid 10-digit mobile number.");
    setOtpBusy(true);
    const res = await fetch("/api/otp/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: digits }) }).catch(() => null);
    setOtpBusy(false);
    const data = await res?.json().catch(() => null);
    if (!res?.ok || !data?.ok) return setOtpError(data?.error ?? "Couldn't send the code. Try again.");
    setOtpSent(true);
    setOtpDev(Boolean(data.dev));
  }

  async function verifyOtp() {
    setOtpError("");
    setOtpBusy(true);
    const res = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: digits, code: otp }) }).catch(() => null);
    setOtpBusy(false);
    const data = await res?.json().catch(() => null);
    if (!res?.ok || !data?.ok) return setOtpError(data?.error ?? "That code didn't work.");
    setVerified(true);
  }

  function confirmedUrl(ref: string, paymentId: string) {
    const p = new URLSearchParams({
      ref,
      room: room.slug,
      plan: initial.plan,
      in: checkIn,
      out: checkOut,
      adults: String(adults),
      children: String(children),
      total: String(q?.total ?? 0),
      name: name.trim().split(" ")[0],
      phone: digits,
      pay: paymentId,
      booked: today,
    });
    return `/book/confirmed?${p.toString()}`;
  }

  async function verifyAndFinish(order: OrderResponse, r: RazorpaySuccess) {
    const res = await fetch("/api/razorpay/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: order.ref, ...r }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok || !data?.ok) {
      setPaying(false);
      setPayError(`We couldn't verify the payment. If money was deducted, contact us on ${site.phone} with reference ${order.ref}.`);
      return;
    }
    router.push(confirmedUrl(order.ref, r.razorpay_payment_id));
  }

  async function pay() {
    setPayError("");
    if (missing.length) {
      setTried(true);
      return;
    }
    setPaying(true);
    const body: CheckoutRequest = {
      room: room.slug,
      plan: initial.plan,
      checkIn,
      checkOut,
      adults,
      children,
      addOns: initial.addOns,
      coupon,
      guest: {
        name: name.trim(),
        phone: digits,
        email: email.trim(),
        bookingFor,
        otherName: bookingFor === "other" ? otherName.trim() : undefined,
        otherPhone: bookingFor === "other" ? otherPhone.trim() : undefined,
        gstin: gst ? gstin.trim().toUpperCase() : undefined,
        company: gst ? company.trim() : undefined,
        requests,
        message: message.trim(),
      },
    };
    const res = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const order = (await res?.json().catch(() => null)) as (OrderResponse & { error?: string }) | null;
    if (!res?.ok || !order || order.error) {
      setPaying(false);
      setPayError(order?.error ?? "We couldn't start the payment. Check your connection and try again.");
      return;
    }

    if (order.mode === "mock") {
      setMock(order);
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      setPaying(false);
      setPayError("Razorpay didn't load. Check your connection and try again.");
      return;
    }
    openRazorpay(
      {
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: site.name,
        description: `${room.name} · ${q?.nights} nights`,
        order_id: order.orderId,
        prefill: { name: name.trim(), email: email.trim() || undefined, contact: `+91${digits}` },
        notes: { booking_ref: order.ref },
        theme: { color: "#1f6b66" },
      },
      {
        onSuccess: (r) => verifyAndFinish(order, r),
        onFailure: () => {
          setPaying(false);
          setPayError("Payment didn't go through and no money was taken. Your dates are still available — try again.");
        },
        onDismiss: () => setPaying(false),
      },
    );
  }

  const chip = (on: boolean) =>
    `min-h-[38px] rounded-full border-[1.5px] px-3.5 text-sm font-medium transition-colors ${on ? "border-accent bg-accent-tint text-accent-dark" : "border-[#cbd5cd] bg-white text-ink hover:border-accent"}`;
  const toggleBtn = (on: boolean) => `min-h-[38px] rounded-full px-4 text-sm font-semibold transition-colors ${on ? "bg-white text-ink shadow-sm" : "text-muted"}`;

  return (
    <div className="bg-paper pb-28">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 pt-7 sm:px-6">
        <Link href={`/rooms/${room.slug}`} className="inline-flex items-center gap-1.5 self-start font-semibold no-underline">
          <ChevronLeft size={18} /> Back to room
        </Link>
        <h1 className="font-display text-[clamp(32px,4vw,44px)] font-medium leading-[1.05]">Review &amp; book your stay</h1>
        <ol aria-label="Progress" className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          {steps.map((s, i) => (
            <li key={s.label} className={`flex items-center gap-2 text-sm font-semibold ${s.ok ? "text-ink" : "text-muted"}`}>
              <span className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 text-[13px] transition-colors ${s.ok ? "border-accent bg-accent text-white" : "border-[#a9b8ad] bg-white"}`}>
                {s.ok ? "✓" : i + 1}
              </span>
              {s.label}
              {i < steps.length - 1 ? <span className="pl-0.5 text-[#a9b8ad]" aria-hidden="true">—</span> : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-8 px-4 pt-6 sm:px-6">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
          {/* 1. Trip */}
          <section className="card" aria-labelledby="trip-h">
            <h2 id="trip-h" className="font-display text-2xl font-medium">1 · Your trip</h2>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">Dates</div>
                <div className="text-ink-soft">{datesValid ? `${formatShort(checkIn)} – ${formatShort(checkOut)} · ${q?.nights} ${q?.nights === 1 ? "night" : "nights"}` : "Pick your dates"}</div>
              </div>
              <button type="button" className="min-h-9 font-semibold underline hover:text-accent" aria-expanded={editDates} onClick={() => setEditDates((v) => !v)}>
                {editDates ? "Done" : "Edit"}
              </button>
            </div>
            {editDates ? (
              <div className="animate-fade-up grid grid-cols-1 gap-3 rounded-xl bg-paper p-3.5 sm:grid-cols-2">
                <label className="field-label">
                  Check-in
                  <input
                    className="field"
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCheckIn(v);
                      if (nightsBetween(v, checkOut) < 1) setCheckOut(addDays(v, 1));
                    }}
                  />
                </label>
                <label className="field-label">
                  Check-out
                  <input className="field" type="date" min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </label>
              </div>
            ) : null}
            {!datesValid ? <p role="alert" className="rounded-[3px] bg-error-bg px-3 py-2.5 text-sm text-error-ink">Check-out must be after check-in, and check-in can&apos;t be in the past.</p> : null}

            <div className="flex items-start justify-between gap-4 border-t border-line-soft pt-4">
              <div>
                <div className="font-semibold">Guests</div>
                <div className="text-ink-soft">{guestLabel}</div>
              </div>
              <button type="button" className="min-h-9 font-semibold underline hover:text-accent" aria-expanded={editGuests} onClick={() => setEditGuests((v) => !v)}>
                {editGuests ? "Done" : "Edit"}
              </button>
            </div>
            {editGuests ? (
              <div className="animate-fade-up flex flex-col gap-3 rounded-xl bg-paper p-3.5">
                <Stepper label="Adults" hint="13+ years" value={adults} min={1} max={room.maxAdults} onChange={setAdults} />
                <Stepper label="Children" hint="Under 12" value={children} min={0} max={room.maxChildren} onChange={setChildren} />
                <span className="text-[13px] text-muted">
                  This room sleeps {room.baseOccupancy} in the base price, up to {room.maxAdults} adults. Each extra adult is charged per night.
                </span>
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-4 border-t border-line-soft pt-4">
              <div>
                <div className="font-semibold">Room &amp; plan</div>
                <div className="text-ink-soft">
                  {room.name} · {plan.name}
                  {initial.addOns.length ? ` · ${addOns.filter((a) => initial.addOns.includes(a.id)).map((a) => a.name).join(", ")}` : ""}
                </div>
              </div>
              <Link href={`/rooms/${room.slug}?in=${checkIn}&out=${checkOut}&adults=${adults}&children=${children}`} className="min-h-9 font-semibold text-ink">
                Change
              </Link>
            </div>
          </section>

          {/* 2. Guest */}
          <section className="card" aria-labelledby="guest-h">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="guest-h" className="font-display text-2xl font-medium">2 · Guest details</h2>
              {verified ? <span className="animate-fade-up rounded-full bg-accent-tint px-2.5 py-1 text-[13px] font-semibold text-accent">✓ +91 {digits} verified</span> : null}
            </div>

            {!verified ? (
              <div className="flex flex-col gap-3">
                <p className="text-ink-soft">Log in with your mobile number — we&apos;ll send booking updates on WhatsApp.</p>
                <div className="flex flex-wrap items-end gap-2.5">
                  <label className="field-label flex-[1_1_220px]">
                    Mobile number
                    <input className="field" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98xxx xxxxx" value={phone} onChange={(e) => { setPhone(e.target.value); setOtpError(""); }} />
                  </label>
                  <button type="button" className="btn-primary min-h-[46px] rounded-[3px]" onClick={sendOtp} disabled={otpBusy}>
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
                {otpSent ? (
                  <div className="animate-fade-up flex flex-wrap items-end gap-2.5 rounded-xl bg-paper p-3.5">
                    <label className="field-label flex-[1_1_160px]">
                      4-digit code sent to +91 {digits}
                      <input className="field font-semibold tracking-[0.4em]" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={4} placeholder="••••" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                    </label>
                    <button type="button" className="btn-primary min-h-[46px] rounded-[3px]" onClick={verifyOtp} disabled={otp.length !== 4 || otpBusy}>
                      Verify
                    </button>
                    {otpDev ? <span className="basis-full text-[13px] text-muted">Test mode: no SMS provider connected yet, so any 4 digits work.</span> : null}
                  </div>
                ) : null}
                {otpError ? <span role="alert" className="text-sm text-error-ink">{otpError}</span> : null}
              </div>
            ) : null}

            <div role="group" aria-label="Who is this booking for" className="inline-flex self-start rounded-full bg-mist p-1">
              <button type="button" aria-pressed={bookingFor === "self"} onClick={() => setBookingFor("self")} className={toggleBtn(bookingFor === "self")}>Booking for myself</button>
              <button type="button" aria-pressed={bookingFor === "other"} onClick={() => setBookingFor("other")} className={toggleBtn(bookingFor === "other")}>For someone else</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="field-label">
                Your full name
                <input className="field" type="text" autoComplete="name" placeholder="As on your ID" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="field-label">
                Email (for invoice)
                <input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>
            {bookingFor === "other" ? (
              <div className="animate-fade-up grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="field-label">
                  Guest&apos;s full name
                  <input className="field" type="text" placeholder="Who is checking in" value={otherName} onChange={(e) => setOtherName(e.target.value)} />
                </label>
                <label className="field-label">
                  Guest&apos;s mobile
                  <input className="field" type="tel" placeholder="+91" value={otherPhone} onChange={(e) => setOtherPhone(e.target.value)} />
                </label>
              </div>
            ) : null}

            <label className="flex min-h-9 cursor-pointer items-center gap-2.5 font-medium">
              <input type="checkbox" checked={gst} onChange={(e) => setGst(e.target.checked)} className="h-5 w-5 accent-accent" />
              I need a GST invoice for business travel
            </label>
            {gst ? (
              <div className="animate-fade-up grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="field-label">
                  GSTIN
                  <input className="field uppercase" type="text" placeholder="22AAAAA0000A1Z5" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                </label>
                <label className="field-label">
                  Registered company name
                  <input className="field" type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
                </label>
              </div>
            ) : null}

            <div className="flex flex-col gap-2.5 border-t border-line-soft pt-4">
              <div className="font-semibold">Anything we should know? <span className="font-normal text-muted">(optional)</span></div>
              <div className="flex flex-wrap gap-2">
                {REQUESTS.map((r) => {
                  const on = requests.includes(r);
                  return (
                    <button key={r} type="button" aria-pressed={on} className={chip(on)} onClick={() => setRequests((x) => (on ? x.filter((y) => y !== r) : [...x, r]))}>
                      {on ? `✓ ${r}` : r}
                    </button>
                  );
                })}
              </div>
              <label className="field-label">
                Message your host
                <textarea className="field" rows={3} placeholder={`Hi ${site.hostFirstName}, we're arriving around 4 pm from Kochi…`} value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>
            </div>
          </section>

          {/* 3. Payment */}
          <section className="card" aria-labelledby="pay-h">
            <h2 id="pay-h" className="font-display text-2xl font-medium">3 · Payment</h2>
            <div className="flex flex-col gap-2 rounded-[3px] border-2 border-accent bg-accent-wash p-[18px]">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <strong className="text-lg">Pay in full to confirm</strong>
                <strong className="font-display text-2xl">{q ? inr(q.total) : "—"}</strong>
              </div>
              <span className="text-[15px] text-ink-soft">Your room is confirmed once the full amount is paid. Nothing is due at check-in.</span>
            </div>
            <div className="flex items-start gap-3.5 border-t border-line-soft pt-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent"><Lock size={22} /></span>
              <div className="flex flex-col gap-1">
                <strong>Secure payment via Razorpay</strong>
                <span className="text-[15px] text-ink-soft">When you continue, Razorpay&apos;s checkout opens over this page. Choose how you pay inside it.</span>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {["UPI", "Credit & debit cards", "Net banking", "Wallets"].map((m) => (
                <li key={m} className="rounded-full border border-[#cbd5cd] px-3.5 py-1.5 text-sm">{m}</li>
              ))}
            </ul>
            <span className="text-[13px] text-muted">Card and bank details are entered on Razorpay, never on our site.</span>
          </section>

          {/* Cancellation */}
          <section className="card" aria-labelledby="cancel-h">
            <h2 id="cancel-h" className="font-display text-2xl font-medium">Cancellation policy</h2>
            <p className="text-ink-soft">Counted from the day you book. If you book today ({formatShort(today)}):</p>
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <div className="border-t-[5px] border-accent py-3 sm:pr-3">
                <div className="font-semibold">50% refund</div>
                <div className="text-sm text-muted">Cancel until {formatShort(policy.fiftyUntil)}</div>
              </div>
              <div className="border-t-[5px] border-gold py-3 sm:px-3">
                <div className="font-semibold">25% refund</div>
                <div className="text-sm text-muted">{formatShort(policy.quarterFrom)} – {formatShort(policy.quarterUntil)}</div>
              </div>
              <div className="border-t-[5px] border-rust py-3 sm:pl-3">
                <div className="font-semibold">No refund</div>
                <div className="text-sm text-muted">From {formatShort(policy.noRefundFrom)}</div>
              </div>
            </div>
            <p className="text-sm text-muted">Refunds go back through Razorpay to the original payment method in 5–7 working days. Times in IST.</p>
          </section>

          {/* Rules + confirm */}
          <section className="card" aria-labelledby="rules-h">
            <h2 id="rules-h" className="font-display text-2xl font-medium">House rules</h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 pl-5 text-ink-soft sm:grid-cols-2 [&>li]:list-disc">
              {houseRules.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <label className="flex cursor-pointer items-start gap-2.5 border-t border-line-soft pt-4">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
              <span>I agree to the house rules, the <Link href="/policies">cancellation policy</Link> and the terms of stay.</span>
            </label>
            {tried && missing.length ? (
              <div role="alert" className="animate-fade-up rounded-[3px] bg-error-bg px-3.5 py-3 text-sm text-error-ink">Almost there — still needed: {missing.join(", ")}.</div>
            ) : null}
            {payError ? <div role="alert" className="animate-fade-up rounded-[3px] bg-error-bg px-3.5 py-3 text-sm text-error-ink">{payError}</div> : null}
            <button type="button" onClick={pay} disabled={paying} className="btn-primary min-h-14 rounded-xl text-[17px]">
              {paying ? "Opening Razorpay…" : `Pay ${q ? inr(q.total) : ""} securely with Razorpay`}
            </button>
          </section>
        </div>

        <aside aria-label="Price summary" className="w-full flex-[1_1_340px] lg:sticky lg:top-24 lg:max-w-[420px]">
          <PriceSummary room={room} planName={plan.name} checkIn={checkIn} checkOut={checkOut} guestLabel={guestLabel} q={q} coupon={coupon} onCoupon={setCoupon} />
        </aside>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <div>
          <strong className="text-lg">{q ? inr(q.total) : "—"}</strong>
          <div className="text-[13px] text-muted">{q?.nights ?? 0} nights · pay in full via Razorpay</div>
        </div>
        <button type="button" onClick={pay} disabled={paying} className="btn-primary min-h-12 rounded-[3px]">Book now</button>
      </div>

      {mock ? (
        <MockGateway
          amount={mock.amount}
          description={`${room.name}, ${q?.nights} nights`}
          onClose={() => {
            setMock(null);
            setPaying(false);
          }}
          onFail={() => {
            setMock(null);
            setPaying(false);
            setPayError("Payment didn't go through and no money was taken. Your dates are still available — try again.");
          }}
          onSuccess={() =>
            verifyAndFinish(mock, {
              razorpay_order_id: mock.orderId,
              razorpay_payment_id: `pay_mock_${mock.ref}`,
              razorpay_signature: "mock",
            })
          }
        />
      ) : null}
    </div>
  );
}
