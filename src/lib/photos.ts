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
  house: { alt: "The house from the gate, early morning", tone: "#4f6656", src: "/photos/house-at-dawn.jpg" },
  verandah: { alt: "Breakfast on the front verandah", tone: "#5c6b52", src: "/photos/breakfast-verandah.jpg" },
  estate: { alt: "Rows of coffee under shade trees on the estate", tone: "#55684f" },
  kitchen: { alt: "Appam, stew and filter coffee from our kitchen", tone: "#65644b", src: "/photos/breakfast-verandah.jpg" },
  hosts: { alt: "Your hosts on the verandah", tone: "#6f7a68" },
  contact: { alt: "The plantation cottage", tone: "#7d8a78", src: "/photos/plantation-cottage.jpg" },
  footer: { alt: "The house among the palms", tone: "#2f3d34", src: "/photos/house-at-dawn.jpg" },
};

const gallerySrc: Record<number, string> = { 0: "/photos/house-at-dawn.jpg", 1: "/photos/heritage-room.jpg", 2: "/photos/plantation-cottage.jpg", 3: "/photos/breakfast-verandah.jpg", 6: "/photos/family-suite.jpg" };
const gallery: Record<string, PhotoSlot> = Object.fromEntries(
  [
    ["The house in the morning mist", "#7f8f7c"],
    ["Teak ceiling of the heritage room", "#8a7f66"],
    ["Pepper vines around the cottage", "#5f7258"],
    ["Breakfast of appam and stew", "#8b7a5a"],
    ["The path down to the river", "#667a6c"],
    ["A wet afternoon in the monsoon", "#56675d"],
    ["The family suite lounge", "#7a846c"],
    ["Coffee drying in the yard", "#8e8064"],
    ["The lane at dusk", "#46564c"],
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
