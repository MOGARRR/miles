-- Run in Supabase SQL editor to enable quote logging for future invoice diffs.
create table if not exists shipping_quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  destination_postal text not null,
  parcel_count integer not null,
  parcels_json jsonb not null,
  raw_response_json jsonb not null,
  selected_service_code text not null,
  total_cents integer not null
);
