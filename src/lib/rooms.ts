export type PlanId = "bb" | "meals";

export type Room = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Guests included in the base rate. */
  baseOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  sizeSqft: string;
  bed: string;
  view: string;
  chips: string[];
  tags: ("couples" | "families" | "workation")[];
  /** Short amenity badges shown on room cards. */
  badges: string[];
  bedrooms: number;
  /** Nightly rate per plan, in rupees. SAMPLE values — replace with the client's rates. */
  rates: Record<PlanId, number>;
  photos: { label: string; tone: string }[];
};

export const plans: { id: PlanId; name: string; detail: string }[] = [
  { id: "bb", name: "Bed & breakfast", detail: "Breakfast from our kitchen every morning" },
  { id: "meals", name: "All meals included", detail: "Breakfast, lunch and dinner, served family-style" },
];

/** Charged per extra adult per night above a room's base occupancy (sample). */
export const EXTRA_ADULT_PER_NIGHT = 1200;

export const rooms: Room[] = [
  {
    slug: "heritage-room",
    badges: ["Couple friendly", "Garden view", "Work-friendly Wi-Fi"],
    bedrooms: 1,
    name: "[Heritage Room]",
    tagline: "[Original teak ceilings, opens onto the courtyard.]",
    description:
      "[Short paragraph — the room's history, what you see when you wake up, and what makes it different from the other rooms.]",
    baseOccupancy: 2,
    maxAdults: 3,
    maxChildren: 1,
    sizeSqft: "[320]",
    bed: "King bed",
    view: "Garden view",
    chips: ["2 guests", "King bed", "[320] sq ft", "Garden view", "Ensuite bath"],
    tags: ["couples", "workation"],
    rates: { bb: 4500, meals: 6200 },
    photos: [
      { label: "Room · hero photo", tone: "#b8c6bc" },
      { label: "Bed", tone: "#c9d3ca" },
      { label: "Bathroom", tone: "#bfcbc9" },
      { label: "View from window", tone: "#c3cdb7" },
      { label: "Courtyard", tone: "#cdc8b8" },
    ],
  },
  {
    slug: "plantation-cottage",
    badges: ["Couple friendly", "Family friendly", "Estate view"],
    bedrooms: 1,
    name: "[Plantation Cottage]",
    tagline: "[Standalone cottage at the edge of the coffee.]",
    description:
      "[Short paragraph — a standalone cottage at the edge of the estate, with its own verandah and a view over the plantation.]",
    baseOccupancy: 2,
    maxAdults: 3,
    maxChildren: 2,
    sizeSqft: "[450]",
    bed: "Queen + day bed",
    view: "Estate view",
    chips: ["Up to 3 guests", "Queen + day bed", "[450] sq ft", "Private sit-out", "Estate view"],
    tags: ["couples", "families"],
    rates: { bb: 5500, meals: 7400 },
    photos: [
      { label: "Cottage · exterior", tone: "#b5c4b1" },
      { label: "Bedroom", tone: "#c9d3ca" },
      { label: "Sit-out", tone: "#c6cbb6" },
      { label: "Bathroom", tone: "#bfcbc9" },
      { label: "Estate view", tone: "#b9c7b4" },
    ],
  },
  {
    slug: "family-suite",
    badges: ["Family friendly", "2 bedrooms", "Garden view"],
    bedrooms: 2,
    name: "[Family Suite]",
    tagline: "[Two bedrooms around a shared lounge.]",
    description:
      "[Short paragraph — two connected bedrooms around a small lounge, ideal for families or two couples travelling together.]",
    baseOccupancy: 4,
    maxAdults: 4,
    maxChildren: 2,
    sizeSqft: "[700]",
    bed: "2 bedrooms",
    view: "Garden view",
    chips: ["Up to 4 guests", "2 bedrooms", "[700] sq ft", "Shared lounge", "2 baths"],
    tags: ["families"],
    rates: { bb: 7800, meals: 10600 },
    photos: [
      { label: "Suite · lounge", tone: "#c2ccc3" },
      { label: "Bedroom 1", tone: "#c9d3ca" },
      { label: "Bedroom 2", tone: "#bfcbc9" },
      { label: "Bathroom", tone: "#c3cdb7" },
      { label: "Garden", tone: "#b8c6bc" },
    ],
  },
  {
    slug: "whole-home",
    badges: ["Best for groups", "Private cook", "Secured parking"],
    bedrooms: 4,
    name: "[Whole Home]",
    tagline: "[Take over the house for a reunion or a team retreat.]",
    description:
      "[Short paragraph — every room in the house, the dining hall and the verandah are yours, with a private cook for your group.]",
    baseOccupancy: 8,
    maxAdults: 10,
    maxChildren: 4,
    sizeSqft: "[2,400]",
    bed: "All rooms",
    view: "Whole property",
    chips: ["Up to 10 guests", "All rooms", "Private cook", "Dining hall", "Verandah"],
    tags: ["families", "workation"],
    rates: { bb: 21000, meals: 28000 },
    photos: [
      { label: "The house", tone: "#b5c4b1" },
      { label: "Dining hall", tone: "#c9d3ca" },
      { label: "Verandah", tone: "#c6cbb6" },
      { label: "Rooms", tone: "#bfcbc9" },
      { label: "Grounds", tone: "#b9c7b4" },
    ],
  },
];

export function getRoom(slug: string | null | undefined) {
  return rooms.find((r) => r.slug === slug);
}

export const amenities = [
  "Air-conditioning / ceiling fan",
  "Hot water, rain shower",
  "Wi-Fi ([speed] Mbps)",
  "Work desk",
  "Mosquito net",
  "Kettle, coffee from the estate",
  "Toiletries",
  "Power backup",
];
