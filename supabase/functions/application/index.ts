/**
 * Webhook endpoint for completed bond applications from titlebonds.us.
 *
 * Same shape and same guarantees as the `lead` function: shared secret checked
 * in constant time, fails closed when unconfigured, payload revalidated
 * because the caller is remote, and nothing about the applicant is ever
 * logged. It shares LEAD_WEBHOOK_SECRET rather than having its own, because
 * the two endpoints trust exactly the same one caller and a second secret
 * would be a second thing to rotate without being a second boundary.
 */
import { createClient } from "jsr:@supabase/supabase-js@2";
import { timingSafeEqual } from "jsr:@std/crypto@1/timing-safe-equal";
import { sendApplicationNotification, type Notifiable } from "./notify.ts";

const TEXT_FIELDS: Record<string, number> = {
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
};

const OPTIONAL_TEXT: Record<string, number> = { addressLine2: 160, source: 200 };

/** Maps the camelCase wire format onto the table's snake_case columns. */
const COLUMN: Record<string, string> = {
  applicantName: "applicant_name",
  applicantEmail: "applicant_email",
  applicantPhone: "applicant_phone",
  addressLine1: "address_line1",
  addressLine2: "address_line2",
  city: "city",
  region: "region",
  postalCode: "postal_code",
  state: "state",
  vehicleYear: "vehicle_year",
  vehicleMake: "vehicle_make",
  vehicleModel: "vehicle_model",
  vin: "vin",
  source: "source",
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function secretMatches(expected: string, presented: string): boolean {
  const a = new TextEncoder().encode(expected);
  const b = new TextEncoder().encode(presented);
  if (a.byteLength !== b.byteLength) return false;
  return timingSafeEqual(a, b);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const expected = Deno.env.get("LEAD_WEBHOOK_SECRET");
  if (!expected) {
    console.error("LEAD_WEBHOOK_SECRET is not set; refusing all requests");
    return json({ error: "unauthorized" }, 401);
  }
  if (!secretMatches(expected, req.headers.get("x-webhook-secret") ?? "")) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (typeof parsed !== "object" || parsed === null) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const row: Record<string, unknown> = {};
  for (const [key, limit] of Object.entries(TEXT_FIELDS)) {
    const value = body[key];
    if (typeof value !== "string") return json({ error: "invalid", field: key }, 400);
    const cleaned = value.trim().slice(0, limit);
    if (!cleaned) return json({ error: "invalid", field: key }, 400);
    row[COLUMN[key]] = cleaned;
  }
  for (const [key, limit] of Object.entries(OPTIONAL_TEXT)) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      row[COLUMN[key]] = value.trim().slice(0, limit);
    }
  }

  const vehicleValue = Number(body.vehicleValue);
  if (!Number.isFinite(vehicleValue) || vehicleValue <= 0) {
    return json({ error: "invalid", field: "vehicleValue" }, 400);
  }
  row.vehicle_value = vehicleValue;

  // Optional: two states publish no formula, so an application from them
  // carries no estimate at all.
  for (const [key, column] of [
    ["estimatedBondAmount", "estimated_bond_amount"],
    ["estimatedPremium", "estimated_premium"],
  ] as const) {
    const n = Number(body[key]);
    if (body[key] !== undefined && Number.isFinite(n) && n > 0) row[column] = n;
  }

  if (body.details && typeof body.details === "object" && !Array.isArray(body.details)) {
    row.details = body.details;
  }

  row.received_at =
    typeof body.receivedAt === "string" && !Number.isNaN(Date.parse(body.receivedAt))
      ? new Date(body.receivedAt).toISOString()
      : new Date().toISOString();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase.from("applications").insert(row);
  if (error) {
    console.error("application insert failed", error.code, error.message);
    return json({ error: "storage" }, 502);
  }

  // Stored, so nothing below may fail the request.
  const notified = await sendApplicationNotification({
    ...(body as unknown as Notifiable),
    receivedAt: row.received_at as string,
  });
  if (!notified) console.warn("application stored but not notified");

  return json({ ok: true }, 200);
});
