import { inspectVin } from "@/lib/vin";

/**
 * VIN decode, proxied to NHTSA's vPIC database.
 *
 * vPIC is free, needs no key and is the federal vehicle database, which makes
 * it the right source for confirming a VIN describes the vehicle someone says
 * it does. It decodes the VIN only: it says nothing about who owns the car,
 * whether there is a lien, or what it is worth. Those are different products
 * and none of them is what this checks.
 *
 * Proxied rather than called from the browser so the timeout, the caching and
 * the failure shape are ours. Every failure is a 200 with `ok: false`: a
 * decode is a convenience, and an outage at NHTSA must never be something the
 * customer has to understand or work around.
 */

const VPIC = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues";
const TIMEOUT_MS = 4000;

export type VinDecode =
  | {
      ok: true;
      year?: string;
      make?: string;
      model?: string;
      bodyClass?: string;
      vehicleType?: string;
    }
  | { ok: false; reason: "not-decodable" | "not-found" | "unavailable" };

const reply = (body: VinDecode, cache = false) =>
  Response.json(body, {
    headers: cache
      // A VIN decodes to the same answer forever, so this is safe to cache hard.
      ? { "cache-control": "public, max-age=86400, s-maxage=604800" }
      : { "cache-control": "no-store" },
  });

/** vPIC returns "" and "Not Applicable" for absent fields rather than null. */
function value(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed || /^not applicable$/i.test(trimmed)) return undefined;
  return trimmed;
}

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("vin") ?? "";

  // Anything that is not a 17-character VIN with a good check digit will not
  // decode, so it is not worth a round trip. Old serials land here, which is
  // expected rather than an error.
  const shape = inspectVin(input);
  if (shape.kind !== "standard") return reply({ ok: false, reason: "not-decodable" });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${VPIC}/${encodeURIComponent(shape.vin)}?format=json`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!response.ok) return reply({ ok: false, reason: "unavailable" });

    const payload: unknown = await response.json();
    const result =
      typeof payload === "object" && payload !== null && Array.isArray((payload as { Results?: unknown[] }).Results)
        ? ((payload as { Results: unknown[] }).Results[0] as Record<string, unknown> | undefined)
        : undefined;

    if (!result) return reply({ ok: false, reason: "unavailable" });

    const make = value(result.Make);
    const year = value(result.ModelYear);
    // A VIN can be well-formed and still not be in the database, which for this
    // product is unremarkable: it is full of vehicles nobody has decoded since.
    if (!make && !year) return reply({ ok: false, reason: "not-found" }, true);

    return reply(
      {
        ok: true,
        year,
        make,
        model: value(result.Model),
        bodyClass: value(result.BodyClass),
        vehicleType: value(result.VehicleType),
      },
      true,
    );
  } catch {
    // Timeout, DNS, TLS, malformed JSON: all the same to the customer.
    return reply({ ok: false, reason: "unavailable" });
  } finally {
    clearTimeout(timer);
  }
}
