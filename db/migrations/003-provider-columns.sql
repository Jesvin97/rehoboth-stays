-- Run once on the existing database (Cloudflare D1 Console), one statement at a time.
ALTER TABLE bookings RENAME COLUMN razorpay_order_id TO provider_order_id;
ALTER TABLE bookings RENAME COLUMN razorpay_payment_id TO provider_payment_id;
