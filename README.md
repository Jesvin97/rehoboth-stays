# Ambattu Rehoboth Stays — website front end

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4. Booking with full payment through Cashfree.

Design: layout and typography after tajhotels.com (serif headings, tracked uppercase labels, square buttons, gold ornaments), homestay details after voyehomes.com (amenity badges, trust strip, callback request). Fonts: Cormorant Garamond + Jost, self-hosted via @fontsource. Colours: the Rehoboth green palette in `src/app/globals.css`.

## Run it

```bash
npm install
cp .env.example .env.local   # optional — the site runs without keys
npm run dev                  # http://localhost:3000
```

Without Cashfree keys the checkout runs in **mock mode**: a test payment window lets you simulate a successful or failed payment, so the whole flow can be demoed. Without an OTP provider, any 4-digit code is accepted.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage — hero slideshow + availability search, story, rooms (filter, save), experiences, food, offers (copy code), around us, reviews, FAQ, WhatsApp chat |
| `/rooms` | All rooms with date and guest search |
| `/rooms/[slug]` | Room detail — gallery, rate plans, add-ons, live price card |
| `/book` | Checkout — edit trip, OTP login, guest details, GST invoice, coupons, full payment via Cashfree, cancellation timeline |
| `/book/confirmed` | Confirmation |
| `/policies` | Payment & cancellation, house rules, privacy |

## Where to edit content

Everything in `[brackets]` is placeholder copy.

- `src/lib/site.ts` — name, phone, WhatsApp number, address, hosts
- `src/lib/rooms.ts` — rooms, **nightly rates (sample values)**, capacity, extra-adult charge
- `src/lib/pricing.ts` — add-ons, coupon codes, GST rate
- `src/lib/content.ts` — hero captions, experiences, nearby places, reviews, FAQs, house rules
- `src/lib/cancellation.ts` — refund rules (counted from booking date: 50% within 2 days, 25% until day 4, none from day 5)
- Photos: replace the `<Photo>` placeholders with `next/image` once photos are in `public/photos/`

## Payments (Cashfree) and database (Cloudflare D1)

1. Add `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY` and `CASHFREE_ENV=sandbox` (test keys first), plus the `CF_*` database variables and `PII_ENCRYPTION_KEY` (see `.env.example`).
2. `POST /api/pay/order` recalculates the price on the server, holds the dates in D1, and creates a Cashfree order for the full amount.
3. The browser opens Cashfree's payment window. Afterwards `POST /api/pay/verify` asks Cashfree whether the order is paid; the browser is never trusted.
4. The Cashfree webhook (`/api/pay/webhook`) and the return page (`/book/return`) confirm the same way, so a paid booking is saved even if the guest closes the tab.
5. Guests cancel at `/book/cancel` (booking ID + mobile number). The refund % comes from `src/lib/cancellation.ts` (days before check-in) and is sent through Cashfree's refund API.
6. Create the tables with `db/schema.sql` (existing databases: `db/migrations/`).

## Still needed

- A real OTP provider (`api/otp/*`)
- WhatsApp/email confirmations after payment
- Processing refunds per the cancellation policy
- The admin dashboard

## Deploy

Works on Vercel out of the box: import the repo and add the environment variables.
