-- Prevent duplicate orders when Stripe retries checkout.session.completed.
-- Run in Supabase SQL editor. If this fails due to existing duplicates, dedupe first:
--
-- DELETE FROM orders a
-- USING orders b
-- WHERE a.stripe_session_id = b.stripe_session_id
--   AND a.id > b.id;

ALTER TABLE orders
  ADD CONSTRAINT orders_stripe_session_id_unique UNIQUE (stripe_session_id);
