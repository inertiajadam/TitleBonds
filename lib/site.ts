/**
 * Single source of truth for business details and outbound links.
 *
 * `applyUrl()` is deliberately funnelled through one function: today every
 * "Apply Now" hands off to A1 Surety Bonds, but the next phase replaces that
 * with an on-site instant-issue flow backed by the surety API. When that
 * lands, this is the only place that changes.
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

/** Where an "Apply Now" for a given state should send the visitor. */
export function applyUrl(stateName?: string): string {
  const base = `${site.partner.url}/surety-bonds/certificate-of-title-bonds`;
  return stateName
    ? `${base}?state=${encodeURIComponent(stateName)}`
    : base;
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
export function isCanonicalHost(): boolean {
  if (process.env.VERCEL_ENV !== "production") return false;
  return process.env.VERCEL_PROJECT_PRODUCTION_URL === new URL(site.url).host;
}
