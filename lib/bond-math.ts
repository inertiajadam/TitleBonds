/**
 * The bond arithmetic, in a module with no server imports.
 *
 * This lives apart from lib/bond-estimate.ts because the application form
 * recalculates as the customer types, which means running in the browser.
 * bond-estimate.ts reads the state content off disk to validate its rules, so
 * importing it from a client component would pull node:fs into the bundle.
 *
 * Everything here is pure: give it a rule and a value, get figures back.
 * Deciding which rule a state has, and checking that rule against what the
 * state's page says, stays on the server.
 */

/** Premium is a percentage of the bond amount, not of the vehicle's value. */
export const PREMIUM_RATE = 0.015;
export const MINIMUM_PREMIUM = 100;

export type BondRule = {
  /** Bond amount = vehicle value x this. */
  multiplier: number;
  /** Floor the state applies to the bond amount itself, in dollars. */
  minimumBondAmount?: number;
  /** The state's own wording, shown under the figures. */
  basis: string;
};

export type BondEstimate =
  | {
      kind: "estimate";
      /** Dollars, already including any state minimum. */
      bondAmount: number;
      /** Dollars, rounded up so the real figure is never higher than quoted. */
      premium: number;
      multiplier: number;
      basis: string;
    }
  | { kind: "unavailable"; reason: string };

/**
 * `rule` is null for a state that publishes no formula; `noRuleReason` then
 * explains why. Passing both a rule and a reason is a programming error, so
 * the rule wins and the reason is ignored rather than silently suppressing a
 * figure we could have shown.
 */
export function computeEstimate(
  rule: BondRule | null,
  vehicleValue: number,
  noRuleReason = "We confirm the bond amount before quoting.",
): BondEstimate {
  if (!rule) return { kind: "unavailable", reason: noRuleReason };

  if (!Number.isFinite(vehicleValue) || vehicleValue <= 0) {
    return { kind: "unavailable", reason: "Enter the vehicle's value to see an estimate." };
  }

  const bondAmount = Math.max(
    Math.round(vehicleValue * rule.multiplier),
    rule.minimumBondAmount ?? 0,
  );

  return {
    kind: "estimate",
    bondAmount,
    premium: Math.max(Math.ceil(bondAmount * PREMIUM_RATE), MINIMUM_PREMIUM),
    multiplier: rule.multiplier,
    basis: rule.basis,
  };
}

export const usd = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
