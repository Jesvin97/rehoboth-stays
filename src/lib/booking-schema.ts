import type { PlanId } from "./rooms";

/** What the browser sends when it asks the server to start a payment. */
export type CheckoutRequest = {
  room: string;
  plan: PlanId;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  addOns: string[];
  coupon: string | null;
  guest: {
    name: string;
    phone: string; // 10 digits
    email: string;
    bookingFor: "self" | "other";
    otherName?: string;
    otherPhone?: string;
    gstin?: string;
    company?: string;
    requests: string[];
    message: string;
  };
};

export function isCheckoutRequest(x: unknown): x is CheckoutRequest {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  const g = r.guest as Record<string, unknown> | undefined;
  return (
    typeof r.room === "string" &&
    (r.plan === "bb" || r.plan === "meals") &&
    typeof r.checkIn === "string" &&
    typeof r.checkOut === "string" &&
    typeof r.adults === "number" &&
    typeof r.children === "number" &&
    Array.isArray(r.addOns) &&
    !!g &&
    typeof g.name === "string" &&
    g.name.trim().length > 1 &&
    typeof g.phone === "string" &&
    /^[6-9]\d{9}$/.test(g.phone)
  );
}

export function bookingRef() {
  const n = Math.floor(Math.random() * 36 ** 6).toString(36).toUpperCase().padStart(6, "0");
  return `RS-${n}`;
}
