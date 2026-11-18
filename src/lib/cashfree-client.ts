"use client";

type CheckoutResult = { error?: { message?: string }; redirect?: boolean; paymentDetails?: unknown };

type CashfreeInstance = {
  checkout: (opts: { paymentSessionId: string; redirectTarget?: "_modal" | "_self" | "_blank" | "_top" }) => Promise<CheckoutResult | undefined>;
};

declare global {
  interface Window {
    Cashfree?: (opts: { mode: "sandbox" | "production" }) => CashfreeInstance;
  }
}

let loading: Promise<boolean> | null = null;

/** Loads Cashfree's checkout script once. */
export function loadCashfree(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Cashfree) return Promise.resolve(true);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => {
      loading = null;
      resolve(false);
    };
    document.body.appendChild(s);
  });
  return loading;
}

/**
 * Opens Cashfree's payment window over the page. It reports `error` when the guest
 * closes the window or the payment fails, so the caller should always ask the server
 * to check the real status afterwards.
 */
export async function openCashfree(paymentSessionId: string, mode: "sandbox" | "production"): Promise<CheckoutResult | undefined> {
  if (!window.Cashfree) throw new Error("Cashfree not loaded");
  return window.Cashfree({ mode }).checkout({ paymentSessionId, redirectTarget: "_modal" });
}
