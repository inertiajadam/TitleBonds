-- Quote requests from the landing-page form.
--
-- This table holds personal information: a name, a phone number, an email
-- address and a VIN. RLS is enabled with no policies attached, which in
-- Postgres means no anon or authenticated client can read or write a single
-- row. The only thing that touches it is the `lead` edge function, which runs
-- with the service role key and therefore bypasses RLS. That is deliberate:
-- there is no logged-in user on this site, so there is nobody for a policy to
-- grant access to, and an accidentally permissive policy would expose every
-- lead the agency has ever taken.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  -- Fields the bond cannot be written without. Validated again in the edge
  -- function; the not-null constraints are the last line rather than the first.
  name text not null,
  phone text not null,
  email text not null,
  state text not null,
  vehicle text not null,
  vin text not null,

  -- Which deployment sent it, and when the site accepted it. `received_at` is
  -- the site's clock and `created_at` is the database's; they differ when
  -- delivery is retried, which is the case worth being able to see.
  source text,
  received_at timestamptz,
  created_at timestamptz not null default now(),

  -- Worked state, for whoever is calling these people back.
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'issued', 'lost'))
);

alter table public.leads enable row level security;

-- The working query is always "what came in, newest first".
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Finding the repeat caller who lost the same title twice.
create index if not exists leads_phone_idx on public.leads (phone);

comment on table public.leads is
  'Quote requests from titlebonds.us. Contains PII. RLS on with no policies: service role only.';
