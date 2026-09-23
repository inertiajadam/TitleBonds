/**
 * The lead status vocabulary, in a module with no server imports.
 *
 * This lives apart from lib/leads-store.ts because the status dropdown is a
 * client component: importing these from the store would pull the module that
 * holds the service role key into the browser bundle. `server-only` in the
 * store is what makes that a build error rather than a leak.
 *
 * The values match the check constraint on public.leads.status.
 */
export const LEAD_STATUSES = ["new", "contacted", "quoted", "issued", "lost"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}
