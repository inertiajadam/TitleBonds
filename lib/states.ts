import fs from "node:fs";
import path from "node:path";

/**
 * A block of answer content. A plain string is a paragraph; an array of
 * strings is a bulleted list. This keeps the JSON content files readable
 * while still supporting the mixed prose/list answers the source pages use.
 */
export type AnswerBlock = string | string[];

export type StateFaq = {
  q: string;
  a: AnswerBlock[];
};

export type StateRates = {
  /** Dollar ceiling below which no credit check is run, e.g. "$30,000". */
  noCreditCheckUpTo?: string;
  minPremium?: string;
  rate?: string;
  instantIssueUpTo?: string;
  /** How the state calculates the required bond amount. */
  amountRequired?: string;
};

export type TitleBondState = {
  slug: string;
  name: string;
  abbr: string;
  /** The agency that issues bonded titles, e.g. "Texas Department of Motor Vehicles". */
  agency: string;
  statute?: string;
  seoTitle: string;
  metaDescription: string;
  intro: string[];
  rates: StateRates;
  faqs: StateFaq[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "states");

function readStates(): TitleBondState[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"));

  const states = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const state = JSON.parse(raw) as TitleBondState;

    // A slug/filename mismatch would silently 404 a page that the sitemap
    // still advertises, so fail the build instead.
    const expected = file.replace(/\.json$/, "");
    if (state.slug !== expected) {
      throw new Error(
        `State content ${file} declares slug "${state.slug}"; expected "${expected}".`,
      );
    }
    return state;
  });

  return states.sort((a, b) => a.name.localeCompare(b.name));
}

let cache: TitleBondState[] | undefined;

export function getAllStates(): TitleBondState[] {
  cache ??= readStates();
  return cache;
}

export function getState(slug: string): TitleBondState | undefined {
  return getAllStates().find((state) => state.slug === slug);
}

export function getStateSlugs(): string[] {
  return getAllStates().map((state) => state.slug);
}
