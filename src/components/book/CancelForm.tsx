"use client";

import { useState } from "react";
import Link from "next/link";
import { formatShort } from "@/lib/dates";
import { inr } from "@/lib/pricing";
import { site } from "@/lib/site";
import { cleanPhone, isValidMobile } from "@/lib/phone";
import { RefundTimeline } from "../ui/RefundTimeline";

type Preview = {
  ok: true;
  ref: string;
  roomName: string;
  status: "paid" | "cancelled" | "other";
  checkIn: string;
  checkOut: string;
  total: number;
  daysBefore: number;
  canCancel: boolean;
  percent: number;
  refund: number;
  refundStatus?: string | null;
};
type Result = { ok: true; refund: number; percent: number; refundStatus: string; alreadyCancelled?: boolean };

export function CancelForm({ initialRef }: { initialRef: string }) {
  const [ref, setRef] = useState(initialRef);
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [sure, setSure] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function call(action: "preview" | "confirm") {
    setBusy(true);
    setError("");
    const res = await fetch("/api/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref, phone, action }) }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setBusy(false);
    if (!res?.ok || !data?.ok) {
      setError(data?.error ?? "We couldn't reach the server. Check your connection and try again.");
      return null;
    }
    return data;
  }

  async function lookUp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^RS-[0-9A-Z]{6}$/i.test(ref.trim())) return setError("Enter your booking ID, for example RS-AB12CD.");
    if (!isValidMobile(phone)) return setError("Enter the 10-digit mobile number you booked with.");
    const data = await call("preview");
    if (data) {
      setPreview(data);
      setSure(false);
    }
  }

  async function confirm() {
    const data = await call("confirm");
    if (data) setResult(data);
  }

  const input = "field";
  if (result) {
    return (
      <div className="card gap-3" role="status">
        <h2 className="font-display text-2xl font-medium">{result.alreadyCancelled ? "This booking is already cancelled" : "Your booking is cancelled"}</h2>
        {result.refund > 0 ? (
          <>
            <p className="text-ink-soft">Refund: <strong>{inr(result.refund)}</strong> ({result.percent}% of what you paid).</p>
            <p className="text-ink-soft">
              {result.refundStatus === "processed"
                ? "The refund has been sent to your original payment method. Banks usually show it within 5 to 7 working days."
                : result.refundStatus === "failed"
                  ? `The refund could not be sent automatically. Please try this page again later or call us on ${site.phone} with booking ID ${ref.toUpperCase()}.`
                  : "The refund is on its way to your original payment method. Banks usually show it within 5 to 7 working days."}
            </p>
          </>
        ) : (
          <p className="text-ink-soft">No refund applies to a cancellation this close to check-in.</p>
        )}
        <Link href="/" className="font-semibold">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={lookUp} className="card gap-4">
        <label className="field-label">
          Booking ID
          <input className={input} value={ref} onChange={(e) => setRef(e.target.value.toUpperCase().slice(0, 9))} placeholder="RS-AB12CD" autoComplete="off" />
        </label>
        <label className="field-label">
          Mobile number
          <input className={input} type="tel" inputMode="numeric" placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(cleanPhone(e.target.value))} />
        </label>
        <button type="submit" className="btn-primary min-h-12 rounded-[3px]" disabled={busy}>{busy && !preview ? "Checking…" : "Check my booking"}</button>
      </form>

      {error ? <div role="alert" className="rounded-[3px] bg-error-bg px-3.5 py-3 text-sm text-error-ink">{error}</div> : null}

      {preview ? (
        <div className="card gap-4">
          <div>
            <strong className="text-lg">{preview.roomName}</strong>
            <div className="text-sm text-muted">{formatShort(preview.checkIn)} to {formatShort(preview.checkOut)} · paid {inr(preview.total)} · {preview.ref}</div>
          </div>

          {preview.status === "cancelled" ? (
            <p className="text-ink-soft">This booking is already cancelled{preview.refund > 0 ? `, with a refund of ${inr(preview.refund)}` : ""}.</p>
          ) : preview.status !== "paid" ? (
            <p className="text-ink-soft">This booking isn&apos;t confirmed, so there is nothing to cancel. Questions? Call {site.phone}.</p>
          ) : !preview.canCancel ? (
            <p className="text-ink-soft">This stay has already started, so it can&apos;t be cancelled online. Please call {site.phone}.</p>
          ) : (
            <>
              <p className="text-ink-soft">
                You are cancelling <strong>{preview.daysBefore} {preview.daysBefore === 1 ? "day" : "days"}</strong> before check-in. Refund today:{" "}
                <strong>{inr(preview.refund)}</strong> ({preview.percent}% of {inr(preview.total)}).
              </p>
              <RefundTimeline checkIn={preview.checkIn} today={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })} />
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
                <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
                <span>
                  I understand my booking will be cancelled and cannot be restored.{" "}
                  {preview.refund > 0 ? `${inr(preview.refund)} will be refunded to my original payment method.` : "No refund applies."}
                </span>
              </label>
              <button type="button" className="btn-primary min-h-12 rounded-[3px]" disabled={!sure || busy} onClick={confirm}>
                {busy ? "Cancelling…" : preview.refund > 0 ? `Cancel and refund ${inr(preview.refund)}` : "Cancel booking"}
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
