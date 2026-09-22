# Lead delivery

The quote form posts to `/api/quote`, which forwards the lead to
`LEAD_WEBHOOK_URL` with a shared secret in `x-webhook-secret`. The destination
is the `lead` edge function in this directory, which revalidates the payload and
inserts a row into `public.leads`.

If `LEAD_WEBHOOK_URL` is unset the site returns **503** rather than a thank-you
page. That is deliberate: a form that accepts a lead and drops it is worse than
one that admits it cannot take it, because the visitor still has the phone
number. Leaving it unset is a safe state, not a broken one.

## Why a shared secret

The edge function runs with `verify_jwt = false`, because the caller is a
server rather than a signed-in user. That makes the URL publicly reachable, so
the secret is the only thing standing between the leads table and anyone who
finds the endpoint. The function fails closed if the secret is not configured.

## Deploying it

The Supabase project itself has to exist first; everything below assumes its
ref is known.

1. Apply the migration in `migrations/` to create `public.leads`. RLS is on
   with no policies, so only the service role reaches it.
2. Generate a secret (32 random bytes, hex) and set it in two places:
   - the edge function's `LEAD_WEBHOOK_SECRET`
   - the Vercel project's `LEAD_WEBHOOK_SECRET` (production)
3. Deploy `functions/lead` with `verify_jwt = false`.
4. Set the Vercel project's `LEAD_WEBHOOK_URL` (production) to
   `https://<ref>.supabase.co/functions/v1/lead`.
5. Redeploy the site so it picks up the new environment variables, then submit
   a real quote and confirm a row lands in `leads`.

## Reading the leads

There is no admin UI. Leads are read from the Supabase dashboard's table
editor, newest first. If someone needs them elsewhere, the honest next step is
a notification on insert rather than a second copy of the data.
