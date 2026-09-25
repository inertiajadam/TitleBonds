/**
 * VIN handling, with no server imports so the form can use it as they type.
 *
 * A 17-character VIN carries a check digit in position 9, computed from the
 * other sixteen. That makes most typos detectable instantly, offline, before
 * anyone calls an API — which matters here because a wrong VIN on a bond is a
 * wrong bond, and the customer is usually copying it off a door jamb.
 *
 * What this deliberately does not do is reject. Certificate of title bonds
 * exist disproportionately for old trailers, boats and homebuilts whose serial
 * numbers predate the 1981 standard and are not 17 characters at all. Turning
 * those away would turn away exactly the customer this product is for, so
 * everything here reports and nothing blocks.
 */

/** I, O and Q are excluded from VINs so they cannot be confused with 1 and 0. */
const VALID_CHARS = /^[A-HJ-NPR-Z0-9]+$/;

/** Letter values for the check digit, per ISO 3779. */
const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

export type VinShape =
  /** 17 characters, valid charset, check digit agrees. Safe to decode. */
  | { kind: "standard"; vin: string }
  /** 17 characters but the check digit disagrees: almost always a typo. */
  | { kind: "check-digit-failed"; vin: string }
  /** Not a 1981-or-later VIN. Common and legitimate for older property. */
  | { kind: "non-standard"; vin: string };

export function normaliseVin(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export function inspectVin(input: string): VinShape {
  const vin = normaliseVin(input);

  if (vin.length !== 17 || !VALID_CHARS.test(vin)) {
    return { kind: "non-standard", vin };
  }

  let total = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = /\d/.test(char) ? Number(char) : TRANSLITERATION[char];
    // Charset was checked above, so an undefined here would be a bug, not input.
    if (value === undefined) return { kind: "non-standard", vin };
    total += value * WEIGHTS[i];
  }

  const remainder = total % 11;
  const expected = remainder === 10 ? "X" : String(remainder);

  return vin[8] === expected
    ? { kind: "standard", vin }
    : { kind: "check-digit-failed", vin };
}

/** Only a standard VIN is worth sending to NHTSA; the rest will not decode. */
export function isDecodable(input: string): boolean {
  return inspectVin(input).kind === "standard";
}
