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

## The admin

`/admin` lists the leads and lets whoever is working them set a status. It
sits outside the `(site)` route group, so it carries none of the marketing
chrome, and both its routes are dynamic — nothing about it is prerendered.

It needs four environment variables in Vercel (production):

| Variable | What it is |
| --- | --- |
| `ADMIN_PASSWORD` | The shared password for the sign-in page |
| `ADMIN_SESSION_SECRET` | Random 32+ bytes; signs the session cookie |
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key, so it can read past RLS |

With the last two unset the page says so rather than erroring. With the first
two unset nobody can sign in at all, which is the right failure.

One shared password, not per-user accounts: it cannot tell you who looked, and
revoking one person means changing it for everyone. That is the trade-off the
agency's size currently justifies, and `lib/admin-auth.ts` is the file to
replace when it stops being true.
