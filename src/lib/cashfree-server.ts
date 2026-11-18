import "server-only";
import crypto from "node:crypto";

/**
 * Cashfree Payments server helpers.
 * Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY (test keys first), and CASHFREE_ENV
 * to "production" only when going live; it defaults to "sandbox".
 * Without keys the site runs in "mock" mode so the flow can be demoed end to end.
 */
const API_VERSION = "2023-08-01";

export function cashfreeConfigured() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

export function cashfreeEnv(): "sandbox" | "production" {
  return process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
}

const base = () => (cashfreeEnv() === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg");

async function cf<T>(path: string, init?: { method: "POST"; body: unknown }): Promise<T> {
  const res = await fetch(base() + path, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": API_VERSION,
      "x-client-id": process.env.CASHFREE_APP_ID!,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    },
    body: init ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cashfree ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

export type CashfreeOrder = {
  cf_order_id: number | string;
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string; // ACTIVE | PAID | EXPIRED | TERMINATED
  payment_session_id?: string;
};

/** Creates an order. `orderId` is our booking reference. */
export function createOrder(p: {
  orderId: string;
  amountRupees: number;
  customer: { id: string; phone: string; name: string; email?: string };
  returnUrl?: string;
  expiresInMinutes: number;
  note: string;
}) {
  return cf<CashfreeOrder>("/orders", {
    method: "POST",
    body: {
      order_id: p.orderId,
      order_amount: p.amountRupees,
      order_currency: "INR",
      customer_details: {
        customer_id: p.customer.id,
        customer_phone: p.customer.phone,
        customer_name: p.customer.name,
        ...(p.customer.email ? { customer_email: p.customer.email } : {}),
      },
      order_meta: p.returnUrl ? { return_url: p.returnUrl } : undefined,
      order_expiry_time: new Date(Date.now() + p.expiresInMinutes * 60_000).toISOString(),
      order_note: p.note.slice(0, 200),
    },
  });
}

export function getOrder(orderId: string) {
  return cf<CashfreeOrder>(`/orders/${encodeURIComponent(orderId)}`);
}

/** The id of the successful payment on an order, if any. */
export async function getPaidPaymentId(orderId: string): Promise<string | null> {
  const list = await cf<{ cf_payment_id: number | string; payment_status: string }[]>(`/orders/${encodeURIComponent(orderId)}/payments`);
  const ok = Array.isArray(list) ? list.find((x) => x.payment_status === "SUCCESS") : null;
  return ok ? String(ok.cf_payment_id) : null;
}

/** Cashfree signs `timestamp + rawBody` with your secret key (HMAC-SHA256, base64). */
export function verifyWebhookSignature(rawBody: string, signature: string, timestamp: string) {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret || !signature || !timestamp) return false;
  const expected = crypto.createHmac("sha256", secret).update(timestamp + rawBody).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
