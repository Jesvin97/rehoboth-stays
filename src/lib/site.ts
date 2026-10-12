/**
 * Site-wide details. Everything in [brackets] is a placeholder to replace
 * with the client's real information.
 */
export const site = {
  name: "Rehoboth Stays",
  initial: "R",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  region: "[Region], Kerala",
  locationLine: "[Village], [District], Kerala · 45 min from [Nearest airport]",
  address: "[Full address], Kerala [PIN]",
  phone: "+91 [PHONE]",
  phoneHref: "tel:+910000000000",
  whatsappNumber: "910000000000", // digits only, used for wa.me links
  email: "[EMAIL]",
  hosts: "[Host names]",
  hostFirstName: "[Host]",
  registration: "Approved by Kerala Tourism · [Grade / Reg. no.]",
  rating: "[4.9]",
  reviewCount: "[N]",
  checkInTime: "2 pm",
  checkOutTime: "11 am",
  description:
    "A family-run homestay in Kerala. Home-cooked meals, a few rooms, and hosts who show you the place the way locals live it.",
  social: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
    maps: "#",
  },
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
