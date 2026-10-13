# Ambattu Rehoboth Stays — website front end

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4. Booking with full payment through Razorpay.

Homepage design: the "split stage" direction from the Taste skill (`design-taste-frontend`): a fixed photograph on one side, a reading column on the other, the room finder in the first screen. Other pages: layout and typography after tajhotels.com (serif headings, tracked uppercase labels, square buttons, gold ornaments), homestay details after voyehomes.com (amenity badges, trust strip, callback request). Fonts: Cormorant Garamond + Jost, self-hosted via @fontsource. Colours: the Rehoboth green palette in `src/app/globals.css`.

## Run it

```bash
npm install
cp .env.example .env.local   # optional — the site runs without keys
npm run dev                  # http://localhost:3000
```

Without Razorpay keys the checkout runs in **mock mode**: a test payment window lets you simulate a successful or failed payment, so the whole flow can be demoed. Without an OTP provider, any 4-digit code is accepted.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage — hero slideshow + availability search, story, rooms (filter, save), experiences, food, offers (copy code), around us, reviews, FAQ, WhatsApp chat |
| `/rooms` | All rooms with date and guest search |
| `/rooms/[slug]` | Room detail — gallery, rate plans, add-ons, live price card |
| `/book` | Checkout — edit trip, OTP login, guest details, GST invoice, coupons, full payment via Razorpay, cancellation timeline |
| `/book/confirmed` | Confirmation |
| `/policies` | Payment & cancellation, house rules, privacy |

## Where to edit content

Everything in `[brackets]` is placeholder copy.

- `src/lib/site.ts` — name, phone, WhatsApp number, address, hosts
- `src/lib/rooms.ts` — rooms, **nightly rates (sample values)**, capacity, extra-adult charge
- `src/lib/pricing.ts` — add-ons, coupon codes, GST rate
- `src/lib/content.ts` — hero captions, experiences, nearby places, reviews, FAQs, house rules
- `src/lib/cancellation.ts` — refund rules (counted from booking date: 50% within 2 days, 25% until day 4, none from day 5)
- `src/lib/photos.ts` — every homepage photograph by name. **To add a real photo:** put the file in `public/photos/` and set its `src` (e.g. `src: "/photos/house-from-gate.jpg"`). Until then each slot shows a flat tone with a caption saying what belongs there.

## Payments (Razorpay)

1. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local` (test keys first).
2. `POST /api/razorpay/order` recalculates the price on the server and creates an order for the full amount.
3. The browser opens Razorpay Checkout; on success `POST /api/razorpay/verify` checks the signature.

## Still needed from a backend

These are marked `TODO(backend)` in the code:

- Live room availability before taking payment (`api/razorpay/order`)
- Saving bookings, blocking dates, and sending WhatsApp/email confirmations (`api/razorpay/verify`)
- A Razorpay `payment.captured` webhook, so bookings confirm even if the guest closes the tab
- A real OTP provider (`api/otp/*`)
- Loading the confirmation page from the saved booking instead of the URL
- Processing refunds per the cancellation policy

## Deploy

Works on Vercel out of the box: import the repo and add the environment variables.
