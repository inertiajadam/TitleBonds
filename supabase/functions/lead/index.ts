/**
 * Webhook endpoint for quote requests from titlebonds.us.
 *
 * The site posts here with a shared secret; this function checks the secret,
 * revalidates the payload and inserts a row. JWT verification is off because
 * the caller is a server, not a signed-in user, so the secret is the only
 * gate. That makes it worth being careful with: the comparison is
 * constant-time, and a missing secret fails closed rather than open.
 *
 * Nothing about the lead is logged. An error here is logged by class, never by
 * content, because the content is somebody's name, phone number and VIN.
 */
import { createClient } from "jsr:@supabase/supabase-js@2";
import { timingSafeEqual } from "jsr:@std/crypto@1/timing-safe-equal";
import { sendLeadNotification, type Notifiable } from "./notify.ts";

const REQUIRED = ["name", "phone", "email", "state", "vehicle", "vin"] as const;

/** Mirrors FIELD_LIMITS in lib/leads.ts. Re-applied because the caller is remote. */
const FIELD_LIMITS: Record<string, number> = {
  name: 120,
  phone: 40,
  email: 160,
  state: 40,
  vehicle: 160,
  vin: 40,
  source: 200,
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

/** Constant-time, and false when either side is missing or differently sized. */
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
    // Fail closed. An endpoint with no secret configured accepts anything.
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

  const row: Record<string, string> = {};
  for (const key of REQUIRED) {
    const value = body[key];
    if (typeof value !== "string") return json({ error: "invalid", field: key }, 400);
    const trimmed = value.trim().slice(0, FIELD_LIMITS[key]);
    if (!trimmed) return json({ error: "invalid", field: key }, 400);
    row[key] = trimmed;
  }

  if (typeof body.source === "string") {
    row.source = body.source.trim().slice(0, FIELD_LIMITS.source);
  }

  // The site's own timestamp. Rejected rather than trusted if it is not a real
  // date, so a malformed value cannot land in a timestamptz column.
  const receivedAt =
    typeof body.receivedAt === "string" && !Number.isNaN(Date.parse(body.receivedAt))
      ? new Date(body.receivedAt).toISOString()
      : new Date().toISOString();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase
    .from("leads")
    .insert({ ...row, received_at: receivedAt });

  if (error) {
    // Code and message only. The row itself is not logged.
    console.error("lead insert failed", error.code, error.message);
    return json({ error: "storage" }, 502);
  }

  // The lead is safe now, so nothing below this line may fail the request.
  // A stored lead nobody was emailed about is recoverable from the admin; a
  // lead rejected because an email provider was down is gone for good.
  const notified = await sendLeadNotification({ ...(row as Notifiable), receivedAt });
  if (!notified) console.warn("lead stored but not notified");

  return json({ ok: true }, 200);
});
