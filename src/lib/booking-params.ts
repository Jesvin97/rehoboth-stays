import { addDays, defaultStay, nightsBetween, parseISO, todayIST } from "./dates";
import { addOns } from "./pricing";
import type { PlanId } from "./rooms";

export type SearchParams = Record<string, string | string[] | undefined>;

export type Stay = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
};

export type BookingSelection = Stay & {
  room: string;
  plan: PlanId;
  addOns: string[];
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const int = (v: string | undefined, fallback: number, min: number, max: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Read stay details from a URL, falling back to sensible defaults. */
export function parseStay(sp: SearchParams): Stay {
  const d = defaultStay();
  let checkIn = one(sp.in) ?? d.checkIn;
  let checkOut = one(sp.out) ?? d.checkOut;
  if (!parseISO(checkIn) || checkIn < todayIST()) checkIn = d.checkIn;
  if (!parseISO(checkOut) || nightsBetween(checkIn, checkOut) < 1) checkOut = addDays(checkIn, 2);
  return {
    checkIn,
    checkOut,
    adults: int(one(sp.adults), 2, 1, 10),
    children: int(one(sp.children), 0, 0, 6),
  };
}

export function parseSelection(sp: SearchParams): BookingSelection {
  const plan = one(sp.plan) === "meals" ? "meals" : "bb";
  const valid = new Set<string>(addOns.map((a) => a.id));
  const picked = (one(sp.addons) ?? "").split(",").filter((a) => valid.has(a));
  return { ...parseStay(sp), room: one(sp.room) ?? "", plan, addOns: picked };
}

export function stayQuery(s: Stay) {
  return new URLSearchParams({ in: s.checkIn, out: s.checkOut, adults: String(s.adults), children: String(s.children) }).toString();
}

export function selectionQuery(s: BookingSelection) {
  const q = new URLSearchParams({ room: s.room, plan: s.plan, in: s.checkIn, out: s.checkOut, adults: String(s.adults), children: String(s.children) });
  if (s.addOns.length) q.set("addons", s.addOns.join(","));
  return q.toString();
}
