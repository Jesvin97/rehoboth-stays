import "server-only";
import crypto from "node:crypto";

/**
 * Razorpay server helpers. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in
 * .env.local (test keys from the Razorpay dashboard). Without them the site
 * runs in "mock" mode so the flow can be demoed end to end.
 */
export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createOrder(params: { amountRupees: number; receipt: string; notes: Record<string, string> }) {
  const keyId = process.env.RAZORPAY_KEY_ID!;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${keyId}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: Math.round(params.amountRupees * 100), // paise
      currency: "INR",
      receipt: params.receipt,
      notes: params.notes,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order failed (${res.status}): ${text}`);
  }
  return (await res.json()) as { id: string; amount: number; currency: string };
}

/** Razorpay signs `${order_id}|${payment_id}` with your key secret. */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
