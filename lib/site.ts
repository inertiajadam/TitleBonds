/**
 * Single source of truth for business details and outbound links.
 *
 * `applyUrl()` is deliberately funnelled through one function, which is what
 * made moving every "Apply Now" from A1 Surety Bonds to the on-site flow a
 * one-line change. A1 remains the bond partner and is still named in the
 * privacy policy and on the About page; what changed is where the customer
 * fills the form in, not who writes the bond.
 */
export const site = {
  name: "The Title Bond Agency",
  shortName: "TitleBonds.us",
  url: "https://titlebonds.us",
  description:
    "Replace a lost, stolen, damaged or defective vehicle title with a certificate of title bond. Rates from 1.5%, no credit check under $30,000, most bonds issued the same day.",
  phone: "(800) 737-4880",
  phoneHref: "tel:+18007374880",
  email: "info@a1suretybonds.com",
  address: {
    street: "2740 N. Mt. Juliet Rd. #13",
    city: "Mt. Juliet",
    region: "TN",
    postalCode: "37122",
    country: "US",
  },
  partner: {
    name: "A1 Surety Bonds",
    url: "https://a1suretybonds.com",
  },
} as const;

/**
 * Verifiable credentials for the About page.
 *
 * Deliberately empty. Every entry here is a claim a visitor could check and
 * that a regulator could hold the agency to, so none of it can be inferred or
 * approximated — a licence number, a rating or a founding year has to come
 * from the business. The About page renders this section only when it has
 * something true to put in it, rather than showing placeholders.
 *
 * To populate: add entries and they appear. Nothing else changes.
 */
export type Credential = {
  /** e.g. "Licensed in", "Founded", "Better Business Bureau" */
  label: string;
  /** The value exactly as it may be stated publicly. */
  value: string;
  /** Optional page where someone can verify the claim. */
  href?: string;
};

export const credentials: Credential[] = [];

/**
 * Where an "Apply Now" should send the visitor.
 *
 * Takes the state's slug rather than its display name because the slugs are
 * the legacy WordPress ones and do not follow from the name: Tennessee is
 * "tennessee-title-bonds" but Iowa is just "iowa". Deriving one from the other
 * would 404 on about half the states.
 */
export function applyUrl(stateSlug?: string): string {
  return stateSlug ? `/apply/${stateSlug}` : "/apply";
}

export const formattedAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

/**
 * Whether this deployment is the canonical titlebonds.us site.
 *
 * Preview builds and the project's *.vercel.app URLs serve the same content as
 * production. Letting search engines index them would put a duplicate of the
 * whole site in competition with the real domain, which is the one thing this
 * rebuild exists to protect.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is the domain Vercel considers this project's
 * production host. It only equals the canonical host once titlebonds.us is
 * attached as the production domain, so indexing turns itself on at cutover
 * with no flag to remember.
 */
/**
 * True on a production deployment, whatever host it is served from.
 *
 * Analytics keys off this rather than the canonical host so that measurement
 * works before titlebonds.us is attached, while indexing stays gated on
 * isCanonicalHost below. Preview and branch builds still send nothing.
 */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function isCanonicalHost(): boolean {
  if (process.env.VERCEL_ENV !== "production") return false;
  return process.env.VERCEL_PROJECT_PRODUCTION_URL === new URL(site.url).host;
}
