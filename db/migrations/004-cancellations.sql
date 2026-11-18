-- Run once on the existing database (Cloudflare D1 Console), one statement at a time.
ALTER TABLE bookings ADD COLUMN cancelled_at INTEGER;
ALTER TABLE bookings ADD COLUMN cancel_reason TEXT;
ALTER TABLE bookings ADD COLUMN refund_percent INTEGER;
ALTER TABLE bookings ADD COLUMN refund_amount INTEGER;
ALTER TABLE bookings ADD COLUMN refund_id TEXT;
ALTER TABLE bookings ADD COLUMN refund_status TEXT;
