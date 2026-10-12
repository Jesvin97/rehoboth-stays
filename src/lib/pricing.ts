import { EXTRA_ADULT_PER_NIGHT, getRoom, type PlanId } from "./rooms";
import { nightsBetween } from "./dates";

/**
 * Pricing is shared by the browser (to show the summary) and the server
 * (to create the Razorpay order). The server ALWAYS recalculates — never
 * trust an amount sent from the browser.
 */

/** GST on room tariff. 5% applies to rooms up to ₹7,500/night — confirm with the client's accountant. */
export const GST_RATE = 0.05;

export const addOns = [
  { id: "pickup", name: "Airport pickup", price: 1800, unit: "one way" },
  { id: "dinner", name: "Candlelight dinner", price: 2500, unit: "for two" },
  { id: "cooking", name: "Cooking class", price: 1200, unit: "per stay" },
  { id: "spa", name: "Ayurveda massage", price: 2200, unit: "60 min" },
] as const;
export type AddOnId = (typeof addOns)[number]["id"];

export const coupons = [
  { code: "DIRECT10", title: "10% off when you book on our website", type: "percent", value: 10, minNights: 1 },
  { code: "EARLY30", title: "₹750 off — booked 30+ days ahead", type: "flat", value: 750, minNights: 2 },
  { code: "STAY5", title: "15% off on stays of 5 nights or more", type: "percent", value: 15, minNights: 5 },
] as const;
export type CouponCode = (typeof coupons)[number]["code"];

export type QuoteInput = {
  roomSlug: string;
  plan: PlanId;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  addOns: string[];
  coupon?: string | null;
};

export type Quote = {
  ok: true;
  nights: number;
  nightlyRate: number;
  roomTotal: number;
  extraAdults: number;
  extraAdultTotal: number;
  addOnLines: { id: string; name: string; price: number }[];
  addOnTotal: number;
  coupon: { code: string; discount: number } | null;
  couponError: string | null;
  taxable: number;
  gst: number;
  total: number;
};

export type QuoteError = { ok: false; error: string };

export function findCoupon(code: string | null | undefined) {
  if (!code) return undefined;
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}

export function couponDiscount(code: string, roomCost: number, nights: number): number {
  const c = findCoupon(code);
  if (!c || nights < c.minNights) return 0;
  return c.type === "percent" ? Math.round((roomCost * c.value) / 100) : Math.min(c.value, roomCost);
}

export function quote(input: QuoteInput): Quote | QuoteError {
  const room = getRoom(input.roomSlug);
  if (!room) return { ok: false, error: "Room not found." };
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) return { ok: false, error: "Check-out must be after check-in." };
  if (nights > 30) return { ok: false, error: "Stays longer than 30 nights — please contact us." };
  if (input.adults < 1 || input.adults > room.maxAdults) return { ok: false, error: `This room takes up to ${room.maxAdults} adults.` };
  if (input.children < 0 || input.children > room.maxChildren) return { ok: false, error: `This room takes up to ${room.maxChildren} children.` };

  const nightlyRate = room.rates[input.plan];
  if (!nightlyRate) return { ok: false, error: "Unknown rate plan." };

  const roomTotal = nightlyRate * nights;
  const extraAdults = Math.max(0, input.adults - room.baseOccupancy);
  const extraAdultTotal = extraAdults * EXTRA_ADULT_PER_NIGHT * nights;

  const addOnLines = addOns
    .filter((a) => input.addOns.includes(a.id))
    .map((a) => ({ id: a.id, name: a.name, price: a.price }));
  const addOnTotal = addOnLines.reduce((s, a) => s + a.price, 0);

  const roomCost = roomTotal + extraAdultTotal;
  let coupon: Quote["coupon"] = null;
  let couponError: string | null = null;
  if (input.coupon) {
    const c = findCoupon(input.coupon);
    if (!c) couponError = "That code isn't valid.";
    else if (nights < c.minNights) couponError = `${c.code} needs at least ${c.minNights} nights.`;
    else coupon = { code: c.code, discount: couponDiscount(c.code, roomCost, nights) };
  }

  const taxable = roomCost - (coupon?.discount ?? 0) + addOnTotal;
  const gst = Math.round(taxable * GST_RATE);
  const total = taxable + gst;

  return { ok: true, nights, nightlyRate, roomTotal, extraAdults, extraAdultTotal, addOnLines, addOnTotal, coupon, couponError, taxable, gst, total };
}

export function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
