"use client";

import { useEffect, useState } from "react";
import { inr } from "@/lib/pricing";
import { site } from "@/lib/site";
import { Close } from "../ui/Icons";

/**
 * Stand-in for Razorpay Checkout, shown only when no Razorpay keys are set.
 * Lets the full flow (success and failure) be demoed without real payments.
 */
export function MockGateway({
  amount,
  description,
  onSuccess,
  onFail,
  onClose,
}: {
  amount: number;
  description: string;
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(20,30,25,0.55)] p-4">
      <div role="dialog" aria-modal="true" aria-label="Razorpay checkout (test mode)" className="animate-fade-up w-[420px] max-w-full overflow-hidden rounded-[3px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4.5 py-4">
          <div className="flex flex-col">
            <strong>{site.name}</strong>
            <span className="text-[13px] text-muted">Paying {inr(amount)} · {description}</span>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close payment window" className="flex h-9 w-9 items-center justify-center rounded-full bg-mist disabled:opacity-40">
            <Close size={18} />
          </button>
        </div>
        {busy ? (
          <div className="flex flex-col items-center gap-4 px-4.5 py-12 text-center">
            <span className="h-11 w-11 animate-spin rounded-full border-4 border-line border-t-accent" aria-hidden="true" />
            <strong>Confirming your payment…</strong>
            <span className="text-sm text-muted">Please don&apos;t close this window.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4.5">
            <div className="flex h-[200px] items-center justify-center rounded-xl bg-sage p-5 text-center text-xs font-semibold uppercase tracking-[0.06em] text-[#2e4238]">
              [Razorpay Checkout opens here — UPI, cards, net banking, wallets]
            </div>
            <span className="text-center text-[13px] text-muted">Test mode: no Razorpay keys are set. Choose an outcome.</span>
            <button
              type="button"
              className="btn-primary min-h-12 rounded-[3px]"
              onClick={() => {
                setBusy(true);
                setTimeout(onSuccess, 1400);
              }}
            >
              Simulate successful payment
            </button>
            <button type="button" onClick={onFail} className="min-h-[46px] rounded-[3px] border-[1.5px] border-rust font-semibold text-rust hover:bg-error-bg">
              Simulate failed payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
