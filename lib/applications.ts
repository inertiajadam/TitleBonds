import { site } from "@/lib/site";

/**
 * Completed bond applications.
 *
 * Shaped like lib/leads.ts on purpose: same parse-then-deliver split, same
 * treatment of an unconfigured destination as an outage rather than a silent
 * drop. Someone who has filled in their legal name, home address and VIN has
 * spent real effort, so pretending to accept it and throwing it away would be
 * worse here than it is for a callback request.
 *
 * `details` carries whatever the bond platform's application spec turns out to
 * need beyond the fields below. It is passed through untouched apart from a
 * size cap, because this file cannot know what is in it yet.
 */

export type Application = {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  state: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  vehicleValue: number;
  estimatedBondAmount?: number;
  estimatedPremium?: number;
  details?: Record<string, unknown>;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "upstream" };

const REQUIRED_LIMITS = {
  applicantName: 120,
  applicantEmail: 160,
  applicantPhone: 40,
  addressLine1: 160,
  city: 80,
  region: 40,
  postalCode: 20,
  state: 40,
  vehicleYear: 8,
  vehicleMake: 60,
  vehicleModel: 80,
  vin: 40,
} as const;

const OPTIONAL_LIMITS = { addressLine2: 160 } as const;

/** Dollar ceiling above which this is not a title bond we can price. */
const MAX_VEHICLE_VALUE = 5_000_000;
const MAX_DETAILS_BYTES = 8_000;

function trimmed(value: unknown, limit: number): string | null {
  if (typeof value !== "string") return null;
  const out = value.trim().slice(0, limit);
  return out === "" ? null : out;
}

export function parseApplication(input: unknown): Application | null {
  if (typeof input !== "object" || input === null) return null;
  const raw = input as Record<string, unknown>;
  const out = {} as Application;

  for (const [key, limit] of Object.entries(REQUIRED_LIMITS)) {
    const value = trimmed(raw[key], limit);
    if (value === null) return null;
    (out as Record<string, unknown>)[key] = value;
  }

  for (const [key, limit] of Object.entries(OPTIONAL_LIMITS)) {
    const value = trimmed(raw[key], limit);
    if (value !== null) (out as Record<string, unknown>)[key] = value;
  }

  // Deliberately loose, exactly as the quote form is: a serial from a 1960s
  // trailer is not 17 characters and this product exists for that customer.
  if (!out.applicantEmail.includes("@") || out.applicantEmail.startsWith("@")) return null;
  if (out.applicantPhone.replace(/\D/g, "").length < 10) return null;

  const value = Number(raw.vehicleValue);
  if (!Number.isFinite(value) || value <= 0 || value > MAX_VEHICLE_VALUE) return null;
  out.vehicleValue = Math.round(value * 100) / 100;

  // Estimates are optional because two states publish no formula. When present
  // they must be real numbers; a malformed one is dropped rather than stored,
  // since a wrong figure on the record is worse than no figure.
  for (const key of ["estimatedBondAmount", "estimatedPremium"] as const) {
    const n = Number(raw[key]);
    if (raw[key] !== undefined && Number.isFinite(n) && n > 0) out[key] = n;
  }

  if (raw.details && typeof raw.details === "object" && !Array.isArray(raw.details)) {
    const serialised = JSON.stringify(raw.details);
    if (serialised.length <= MAX_DETAILS_BYTES) {
      out.details = raw.details as Record<string, unknown>;
    }
  }

  return out;
}

export async function deliverApplication(
  application: Application,
): Promise<DeliveryResult> {
  const endpoint = process.env.APPLICATION_WEBHOOK_URL;
  if (!endpoint) return { ok: false, reason: "unconfigured" };

  const headers: Record<string, string> = { "content-type": "application/json" };
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  if (secret) headers["x-webhook-secret"] = secret;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...application,
        source: site.url,
        receivedAt: new Date().toISOString(),
      }),
    });
    return response.ok ? { ok: true } : { ok: false, reason: "upstream" };
  } catch {
    return { ok: false, reason: "upstream" };
  }
}
