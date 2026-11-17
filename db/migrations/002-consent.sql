-- Run once on the existing database (Cloudflare D1 Console), one statement at a time.
ALTER TABLE bookings ADD COLUMN consent_at INTEGER;
ALTER TABLE bookings ADD COLUMN consent_version TEXT;
ALTER TABLE leads ADD COLUMN consent_at INTEGER;
ALTER TABLE leads ADD COLUMN consent_version TEXT;
