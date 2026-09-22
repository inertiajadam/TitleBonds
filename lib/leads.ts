import { site } from "@/lib/site";

/**
 * Quote requests from the landing pages.
 *
 * Delivery is deliberately behind one function. The bond-issuing platform is
 * not connected yet, so rather than accepting a lead and dropping it, an
 * unconfigured destination is treated as an outage: the caller is told, and the
 * page falls back to the phone number. A form that returns "thanks" and throws
 * the lead away is worse than one that admits it cannot take it right now.
 *
 * To connect it, set LEAD_WEBHOOK_URL and nothing else here changes.
 *
 * LEAD_WEBHOOK_SECRET is optional and sent as `x-webhook-secret` when present.
 * The destination we run (a Supabase edge function) requires it, because the
 * endpoint is public and a lead row is cheap to forge otherwise. A destination
 * that authenticates some other way, or not at all, simply leaves it unset.
 */

export type Lead = {
  name: string;
  phone: string;
  email: string;
  state: string;
  vehicle: string;
  vin: string;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "upstream" };

const FIELD_LIMITS: Record<keyof Lead, number> = {
  name: 120,
  phone: 40,
  email: 160,
  state: 40,
  vehicle: 160,
  vin: 40,
};

/** Trim, cap length, and require the fields a bond cannot be written without. */
export function parseLead(input: unknown): Lead | null {
  if (typeof input !== "object" || input === null) return null;
  const raw = input as Record<string, unknown>;
  const out = {} as Lead;

  for (const key of Object.keys(FIELD_LIMITS) as Array<keyof Lead>) {
    const value = raw[key];
    if (typeof value !== "string") return null;
    const trimmed = value.trim().slice(0, FIELD_LIMITS[key]);
    if (!trimmed) return null;
    out[key] = trimmed;
  }

  // Loose on purpose: a serial number from a 1960s trailer is not 17 characters,
  // and rejecting it would turn away exactly the customer this product is for.
  if (!out.email.includes("@") || out.email.startsWith("@")) return null;
  if (out.phone.replace(/\D/g, "").length < 10) return null;

  return out;
}

export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) return { ok: false, reason: "unconfigured" };

  const headers: Record<string, string> = { "content-type": "application/json" };
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  if (secret) headers["x-webhook-secret"] = secret;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...lead, source: site.url, receivedAt: new Date().toISOString() }),
    });
    return response.ok ? { ok: true } : { ok: false, reason: "upstream" };
  } catch {
    return { ok: false, reason: "upstream" };
  }
}
