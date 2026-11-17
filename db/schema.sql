-- Cloudflare D1 schema for Ambattu Rehoboth Stays.
-- Safe to run more than once. Apply with: npm run db:migrate

CREATE TABLE IF NOT EXISTS bookings (
  ref                 TEXT PRIMARY KEY,
  room                TEXT NOT NULL,
  plan                TEXT NOT NULL,
  check_in            TEXT NOT NULL,            -- YYYY-MM-DD
  check_out           TEXT NOT NULL,            -- YYYY-MM-DD (guest leaves this morning)
  adults              INTEGER NOT NULL,
  children            INTEGER NOT NULL,
  add_ons             TEXT NOT NULL DEFAULT '[]',
  coupon              TEXT,
  total               INTEGER NOT NULL,         -- rupees, recalculated on the server
  status              TEXT NOT NULL,            -- pending | paid | cancelled | needs_review
  guest_name          TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,
  booking_for         TEXT NOT NULL DEFAULT 'self',
  other_name          TEXT,
  other_phone         TEXT,
  gstin               TEXT,
  company             TEXT,
  requests            TEXT NOT NULL DEFAULT '[]',
  message             TEXT,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          INTEGER NOT NULL,         -- epoch ms
  hold_expires_at     INTEGER NOT NULL,         -- a pending booking blocks the dates until then
  paid_at             INTEGER,
  consent_at          INTEGER,                  -- when the guest agreed to the privacy notice
  consent_version     TEXT                      -- which version of the notice they agreed to
);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings (check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings (room, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_order ON bookings (razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS payment_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref TEXT,
  event      TEXT NOT NULL,
  order_id   TEXT,
  payment_id TEXT,
  amount_paise INTEGER,
  raw        TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE (event, payment_id)
);

CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL,                     -- callback
  name       TEXT,
  phone      TEXT,
  email      TEXT,
  note       TEXT,
  created_at INTEGER NOT NULL,
  consent_at INTEGER,
  consent_version TEXT
);
