-- Completed bond applications from titlebonds.us.
--
-- Separate from `leads` rather than a status on it: a lead is a request to be
-- called back, an application is someone committing to buy a bond, and the two
-- want different columns, different notifications and different urgency. A row
-- here is worth chasing in a way a row there is not.
--
-- Same access posture as leads, and for the same reason: this holds a person's
-- name, home address, phone, email and VIN. RLS is on with no policies, so
-- only the service role behind the edge function reaches it.

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),

  -- Applicant. The name and address here are what goes on the bond itself, so
  -- they are the legal ones rather than whatever is convenient.
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text not null,
  postal_code text not null,

  -- The bond. `state` is the state whose DMV will accept it, which is not
  -- necessarily where the applicant lives.
  state text not null,
  vehicle_year text not null,
  vehicle_make text not null,
  vehicle_model text not null,
  vin text not null,
  vehicle_value numeric(12,2) not null check (vehicle_value > 0),

  -- What the customer was actually shown at the time they applied. Null for
  -- Alabama and New York, which publish no formula and so get no estimate.
  -- Kept because the figures are provisional: when the surety's real number
  -- differs, this is the record of what was on screen when they agreed.
  estimated_bond_amount numeric(12,2),
  estimated_premium numeric(12,2),

  -- Anything the bond platform's application spec turns out to need that is
  -- not above. Lives here so adding a field is a deploy, not a migration.
  details jsonb not null default '{}'::jsonb,

  source text,
  received_at timestamptz,
  created_at timestamptz not null default now(),

  status text not null default 'new'
    check (status in ('new', 'contacted', 'paid', 'submitted', 'issued', 'lost'))
);

alter table public.applications enable row level security;

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

create index if not exists applications_status_idx
  on public.applications (status) where status = 'new';

comment on table public.applications is
  'Completed bond applications from titlebonds.us. Contains PII. RLS on with no policies: service role only.';
