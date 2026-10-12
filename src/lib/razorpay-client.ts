"use client";

export type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (res: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", cb: (res: { error: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (opts: RazorpayOptions) => RazorpayInstance;
  }
}

let loading: Promise<boolean> | null = null;

/** Loads Razorpay's checkout.js once. */
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
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

export function openRazorpay(opts: Omit<RazorpayOptions, "handler" | "modal">, cb: {
  onSuccess: (r: RazorpaySuccess) => void;
  onFailure: (message: string) => void;
  onDismiss: () => void;
}) {
  if (!window.Razorpay) throw new Error("Razorpay not loaded");
  const rzp = new window.Razorpay({ ...opts, handler: cb.onSuccess, modal: { ondismiss: cb.onDismiss } });
  rzp.on("payment.failed", (r) => cb.onFailure(r.error?.description ?? "Payment failed."));
  rzp.open();
}
