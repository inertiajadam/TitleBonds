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

## Where this is deployed

Supabase project `lsowtkebqxdyvpniuglg` ("Title Bonds", us-east-1). The
function is at `https://lsowtkebqxdyvpniuglg.supabase.co/functions/v1/lead`.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` reach Vercel through the
Supabase integration rather than being set by hand, so rotating the key in
Supabase propagates without anyone editing Vercel.

## Deploying it

Kept for the next environment. The steps below are already done for the
project named above.

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

## Notification on insert

After a lead is stored, the function emails whoever is on `LEAD_NOTIFY_TO` via
Resend. The email leads with a tap-to-call button, because a title bond lead is
won by ringing back quickly, and `Reply-To` is the customer, so replying from a
phone reaches them rather than the agency's own inbox.

| Variable | What it is |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `LEAD_NOTIFY_FROM` | Sender, on a domain verified in Resend |
| `LEAD_NOTIFY_TO` | Comma-separated recipients |

All three are set on the edge function, not on Vercel; the site never talks to
Resend. With any of them missing the function still stores the lead and simply
logs that it went un-notified, which is why the admin remains the source of
truth rather than the inbox.

Sending is best effort on purpose: the send happens after the insert and its
result is never allowed to fail the request. A stored lead nobody was emailed
about can be recovered from the admin; a lead rejected because an email
provider was down is gone.

Lead fields are escaped before they reach the HTML body and stripped of
newlines before they reach the subject. Everything in that email was typed by a
stranger into a public form.

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

## Applications

`/apply` collects a full bond application and posts it to `/api/application`,
which forwards to the `application` edge function. Same secret, same
fail-closed behaviour, same 503-rather-than-drop rule as leads. It lands in
`public.applications`, which is separate from `leads` because a lead is a
request to be called back and an application is someone committing to buy.

`APPLICATION_WEBHOOK_URL` points at the function; it reuses
`LEAD_WEBHOOK_SECRET` rather than having its own, because the two endpoints
trust the same one caller and a second secret would be another thing to rotate
without being another boundary.

The table records `estimated_bond_amount` and `estimated_premium`: what the
customer actually saw when they applied. The figures are provisional, so when
the surety's real number differs this is the record of what was on screen.
Both are null for Alabama and New York, which publish no formula.

Anything the bond platform's spec adds later goes in the `details` JSON
column, so a new field is a deploy rather than a migration.

**Payment is not collected.** The gateway is not known yet, so the flow
completes without it and tells the customer they will be called to pay. The
notification email says PAYMENT NOT TAKEN for the same reason.
