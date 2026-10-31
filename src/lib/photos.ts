import { rooms } from "./rooms";
import { experiences } from "./content";

/**
 * Every photograph on the homepage, by key.
 *
 * There are no real photographs of the property yet. Until there are, each
 * slot renders as a flat tone with a caption saying what belongs there.
 * To add a photo: put the file in /public/photos/ and set `src` below,
 * e.g. src: "/photos/house-from-gate.jpg". Nothing else needs to change.
 */
export type PhotoSlot = {
  /** What the photograph shows. Used as alt text and as the placeholder caption. */
  alt: string;
  /** Placeholder tone; also the background while a real photo loads. */
  tone: string;
  /** Path under /public once the client's photo exists. */
  src?: string;
};

const base: Record<string, PhotoSlot> = {
  house: { alt: "The homestay from the gate", tone: "#4f6656", src: "/photos/house-front.jpg" },
  verandah: { alt: "The lantern-lit verandah outside the rooms", tone: "#5c6b52", src: "/photos/verandah-lanterns.jpg" },
  estate: { alt: "Rows of coffee under shade trees on the estate", tone: "#55684f" },
  kitchen: { alt: "Appam, stew and filter coffee from our kitchen", tone: "#65644b" },
  hosts: { alt: "Your hosts on the verandah", tone: "#6f7a68" },
  contact: { alt: "The garden room entrance", tone: "#7d8a78", src: "/photos/garden-room-entrance.jpg" },
  footer: { alt: "The homestay from the gate", tone: "#2f3d34", src: "/photos/house-front.jpg" },
};

const gallerySrc: Record<number, string> = {
  0: "/photos/house-front.jpg",
  1: "/photos/room-teak-bed.jpg",
  2: "/photos/garden-flower-bed.jpg",
  3: "/photos/verandah-lanterns.jpg",
  4: "/photos/courtyard-path.jpg",
  6: "/photos/family-suite.jpg",
  7: "/photos/garden-red-salvia.jpg",
  8: "/photos/courtyard-plant-wall.jpg",
};
const gallery: Record<string, PhotoSlot> = Object.fromEntries(
  [
    ["The homestay from the gate", "#7f8f7c"],
    ["Teak ceiling of the heritage room", "#8a7f66"],
    ["Marigolds and impatiens in the garden", "#5f7258"],
    ["The lantern-lit verandah", "#8b7a5a"],
    ["The courtyard path", "#667a6c"],
    ["A wet afternoon in the monsoon", "#56675d"],
    ["The family suite lounge", "#7a846c"],
    ["Red salvia along the driveway", "#8e8064"],
    ["The plant wall in the courtyard", "#46564c"],
   ].map(([alt, tone], i) => [`gallery-${i + 1}`, { alt, tone, src: gallerySrc[i] }]),
);

const roomSlots: Record<string, PhotoSlot> = Object.fromEntries(
  rooms.map((r) => [`room-${r.slug}`, { alt: `${r.name.replace(/[[\]]/g, "")}: ${r.photos[0].label.toLowerCase()}`, tone: r.photos[0].tone, src: r.photos[0].src }]),
);

const experienceTones = ["#5d7259", "#7a7152", "#557069", "#7c725c"];
const experienceSlots: Record<string, PhotoSlot> = Object.fromEntries(
  experiences.map((e, i) => [`exp-${e.id}`, { alt: e.title, tone: experienceTones[i % experienceTones.length] }]),
);

export const photos: Record<string, PhotoSlot> = { ...base, ...gallery, ...roomSlots, ...experienceSlots };

export function photo(key: string): PhotoSlot {
  return photos[key] ?? { alt: "Photograph to come", tone: "#56675d" };
}

export const galleryKeys = Object.keys(gallery);
