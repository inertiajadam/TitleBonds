import "server-only";

/**
 * Reading and updating leads from the admin.
 *
 * Plain fetch against PostgREST rather than the Supabase client library: the
 * whole surface is one select and one patch, and pulling a client SDK into the
 * app would add a dependency to a site that currently has four.
 *
 * The service role key bypasses RLS, which is the point — the leads table has
 * no policies — but it also means every call here must already be behind an
 * authenticated session. Nothing in this file checks that; the pages and
 * actions that call it do, and that is the invariant to keep.
 */

import type { LeadStatus } from "./lead-status";

export type { LeadStatus };

export type StoredLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  vehicle: string;
  vin: string;
  source: string | null;
  received_at: string | null;
  created_at: string;
  status: LeadStatus;
};

export function leadsStoreIsConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function endpoint(path: string): string {
  const base = process.env.SUPABASE_URL;
  if (!base) throw new Error("SUPABASE_URL is not set");
  return `${base.replace(/\/$/, "")}/rest/v1/${path}`;
}

function headers(): Record<string, string> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

/**
 * Newest first. `limit` exists because this renders as one table with no
 * pagination; when the agency outgrows that, this is where it shows up.
 */
export async function listLeads(limit = 500): Promise<StoredLead[]> {
  const url = `${endpoint("leads")}?select=*&order=created_at.desc&limit=${limit}`;
  const response = await fetch(url, { headers: headers(), cache: "no-store" });
  if (!response.ok) {
    // Status only. The body of a failed leads query can contain lead data.
    throw new Error(`Supabase returned ${response.status} listing leads`);
  }
  return (await response.json()) as StoredLead[];
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const url = `${endpoint("leads")}?id=eq.${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...headers(), prefer: "return=minimal" },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase returned ${response.status} updating a lead`);
}
