/** Homepage and shared content. Bracketed text is placeholder copy. */

export const heroSlides = [
  { label: "The house at dawn", caption: "[Morning mist over the estate]", tone: "#3e5a4c" },
  { label: "Breakfast on the verandah", caption: "[Breakfast on the verandah, from our kitchen]", tone: "#4b5e3f" },
  { label: "The river nearby", caption: "[Five minutes' walk to the river]", tone: "#2f5257" },
  { label: "Plantation walk", caption: "[Walk the coffee rows with your host]", tone: "#56503a" },
];

export const stats = [
  { value: "[N] rooms", label: "Private, family-run" },
  { value: "[N] acres", label: "Of [coffee / spice / paddy]" },
  { value: "Since [Year]", label: "Hosting guests" },
  { value: "[4.9] / 5", label: "[N] reviews on [Google / Airbnb]" },
];

export const roomFilters = [
  { id: "all", label: "All rooms" },
  { id: "couples", label: "Couples" },
  { id: "families", label: "Families" },
  { id: "workation", label: "Workation" },
] as const;

export const experiences = [
  {
    id: "estate-walk",
    short: "Walk the estate",
    tab: "Estate walk",
    title: "Plantation walk with your host",
    meta: "90 min · Complimentary · Every morning",
    description: "[Walk through coffee, pepper and cardamom; see how each is grown, picked and dried.]",
  },
  {
    id: "cooking",
    short: "Cook with us",
    tab: "Cook with us",
    title: "Cook a Kerala meal with the family",
    meta: "2 hrs · ₹[PRICE] per person",
    description: "[Grind the masala, make appam and stew, then sit down and eat what you cooked.]",
  },
  {
    id: "boat",
    short: "A country boat",
    tab: "Country boat",
    title: "Sunrise on a country boat",
    meta: "1 hr · ₹[PRICE] per boat · On request",
    description: "[A local boatman takes you along the river while the village wakes up.]",
  },
  {
    id: "ayurveda",
    short: "Ayurveda at home",
    tab: "Ayurveda",
    title: "Ayurveda massage at home",
    meta: "60 min · ₹[PRICE] · Visiting therapist",
    description: "[A certified therapist comes to the house for abhyanga or a head massage.]",
  },
];

export const places = [
  { name: "[Waterfall]", time: "[20 min]", note: "[Best after the monsoon]" },
  { name: "[Wildlife sanctuary]", time: "[45 min]", note: "[Jeep safari, book a day ahead]" },
  { name: "[Temple / heritage site]", time: "[30 min]", note: "[Dress code applies]" },
  { name: "[Viewpoint / trek]", time: "[1 hr]", note: "[Start by 6 am for the view]" },
  { name: "[Airport / railway station]", time: "[1 hr 15 min]", note: "[Pickup available on request]" },
];

export const reviews = [
  { text: "[Real guest review about the hosts — 2 lines.]", who: "[Guest] · [City] · [Month Year]", source: "Google" },
  { text: "[Real guest review about the food — 2 lines.]", who: "[Guest] · [City] · [Month Year]", source: "Airbnb" },
  { text: "[Real guest review about the rooms and the quiet — 2 lines.]", who: "[Guest] · [City] · [Month Year]", source: "Google" },
  { text: "[Real guest review about the experiences — 2 lines.]", who: "[Guest] · [City] · [Month Year]", source: "Booking.com" },
];

export const faqs = [
  { q: "How do we reach the homestay?", a: "[Nearest airport and station, drive time, road condition, and pickup charges.]" },
  { q: "Is there mobile network and Wi-Fi?", a: "[Which carriers work, Wi-Fi speed, and whether it suits remote work.]" },
  { q: "Are meals included?", a: "Breakfast is included with every stay. Choose the all-meals plan when you book, or ask us for lunch and dinner during your stay." },
  { q: "Can we bring children or pets?", a: "[Child policy, extra bed charges, and pet rules.]" },
  {
    q: "What is the cancellation policy?",
    a: "It is counted from the day you book: cancel within 2 days of booking for a 50% refund, before the 5th day for a 25% refund, and after that there is no refund. Refunds go back through Razorpay to the original payment method in 5–7 working days.",
  },
  { q: "How do I pay?", a: "The full amount is paid online when you book, through Razorpay — UPI, cards, net banking or wallets. Nothing is due at check-in." },
];

export const houseRules = [
  `Check-in from 2 pm · check-out by 11 am`,
  "Government ID for every guest",
  "No loud music after [10 pm]",
  "[No smoking inside the house]",
];
