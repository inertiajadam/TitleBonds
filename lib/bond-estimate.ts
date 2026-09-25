import { getAllStates, type TitleBondState } from "@/lib/states";
import { computeEstimate, type BondEstimate, type BondRule } from "@/lib/bond-math";

export type { BondEstimate, BondRule };

/**
 * Estimating the bond amount and premium from a vehicle's value.
 *
 * PROVISIONAL. Every number here is derived from what the state pages already
 * publish, not from the surety's rating engine. Once the bond platform is
 * connected these figures come from it and this module becomes a fallback for
 * the pre-quote screen, or goes away. Until then the wording around any figure
 * this produces has to keep saying estimate, because that is all it is.
 *
 * Two rules matter more than the arithmetic:
 *
 *   1. A state with no published formula gets no estimate. Alabama sets the
 *      amount from a type-and-age table and New York's DMV sets it case by
 *      case. Inventing a number for those would be worse than showing none,
 *      because a number on screen is one the customer will hold us to.
 *
 *   2. The multipliers are checked against the prose on each state page at
 *      build time. If someone edits Tennessee's page to say 2x and this file
 *      still says 1.5, the build fails rather than quietly quoting low.
 */

/**
 * Keyed by state abbreviation. Every entry is traceable to that state's page.
 * `basis` is filled in from the state's own prose when a rule is handed out,
 * so the wording under the figures can never drift from the page.
 */
const BOND_RULES: Record<string, Omit<BondRule, "basis">> = {
  AK: { multiplier: 1.5 },
  AZ: { multiplier: 1.5 },
  AR: { multiplier: 1.5 },
  CA: { multiplier: 1 },
  CO: { multiplier: 2 },
  CT: { multiplier: 2 },
  FL: { multiplier: 2 },
  GA: { multiplier: 2, minimumBondAmount: 5000 },
  ID: { multiplier: 1.5 },
  IL: { multiplier: 1.5 },
  IA: { multiplier: 1.5 },
  ME: { multiplier: 1.5 },
  MI: { multiplier: 2 },
  MN: { multiplier: 1.5 },
  MS: { multiplier: 1.5 },
  MO: { multiplier: 2, minimumBondAmount: 100 },
  MT: { multiplier: 1 },
  NE: { multiplier: 1.5 },
  NV: { multiplier: 1.5 },
  NH: { multiplier: 1.5 },
  NM: { multiplier: 2 },
  NC: { multiplier: 1.5 },
  RI: { multiplier: 1.5 },
  TN: { multiplier: 1.5 },
  TX: { multiplier: 1.5 },
  UT: { multiplier: 2 },
  VT: { multiplier: 1.5 },
  WA: { multiplier: 1.5 },
  WI: { multiplier: 1.5, minimumBondAmount: 2500 },
  WY: { multiplier: 2 },
};

/**
 * States that deliberately have no rule, and why. Listing them explicitly
 * rather than leaving them out means a newly added state cannot fall through
 * to "no estimate" by being forgotten: the check below fails the build.
 */
const NO_FORMULA: Record<string, string> = {
  AL: "Alabama sets the bond amount from a vehicle type and age table.",
  NY: "The New York DMV sets the bond amount case by case.",
};

export function hasEstimator(abbr: string): boolean {
  return abbr in BOND_RULES;
}

/** Why this state publishes no formula, for showing in place of figures. */
export function noFormulaReason(state: TitleBondState): string {
  return (
    NO_FORMULA[state.abbr] ??
    `We confirm the bond amount for ${state.name} before quoting.`
  );
}

/**
 * The serialisable rule for a state, or null when it has no formula.
 *
 * This is what gets handed to the application form so it can recalculate in
 * the browser as the customer types, without shipping the whole rule table or
 * the content loader to the client.
 */
export function getBondRule(state: TitleBondState): BondRule | null {
  const rule = BOND_RULES[state.abbr];
  if (!rule) return null;
  return { ...rule, basis: state.rates.amountRequired ?? "" };
}

export function estimateBond(state: TitleBondState, vehicleValue: number): BondEstimate {
  return computeEstimate(getBondRule(state), vehicleValue, noFormulaReason(state));
}

/**
 * Build-time check. Runs on import because this module is only ever imported
 * from server code that renders at build or request time.
 *
 * It enforces two things: every state is accounted for exactly once, and the
 * declared multiplier still agrees with the prose the state page publishes.
 */
function validateRules(): void {
  const problems: string[] = [];

  for (const state of getAllStates()) {
    const hasRule = state.abbr in BOND_RULES;
    const hasExemption = state.abbr in NO_FORMULA;

    if (hasRule === hasExemption) {
      problems.push(
        hasRule
          ? `${state.name} (${state.abbr}) is in both BOND_RULES and NO_FORMULA.`
          : `${state.name} (${state.abbr}) is in neither BOND_RULES nor NO_FORMULA.`,
      );
      continue;
    }
    if (!hasRule) continue;

    const prose = state.rates.amountRequired ?? "";
    const declared = BOND_RULES[state.abbr].multiplier;
    // What the prose claims, if it states a multiple at all.
    const stated = prose.match(/(\d+(?:\.\d+)?)\s*x/i)?.[1];

    if (stated === undefined) {
      // No multiple in the prose, so the rule must be a plain 1x.
      if (declared !== 1) {
        problems.push(
          `${state.name} (${state.abbr}) declares ${declared}x but its page states no multiple: "${prose}".`,
        );
      }
    } else if (Number(stated) !== declared) {
      problems.push(
        `${state.name} (${state.abbr}) declares ${declared}x but its page says ${stated}x.`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(`Bond amount rules disagree with state content:\n  ${problems.join("\n  ")}`);
  }
}

validateRules();
