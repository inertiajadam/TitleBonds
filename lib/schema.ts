import type { AnswerBlock, StateFaq, TitleBondState } from "@/lib/states";
import type { Post } from "@/lib/posts";
import { site } from "@/lib/site";
import { stateAnswerText } from "@/components/StateAnswer";

/**
 * Structured data, emitted as one linked @graph per page.
 *
 * Answer engines and LLM crawlers resolve entities by @id far more reliably
 * than they infer them from repeated inline blobs, so every page references
 * the same organization and website nodes rather than redeclaring them.
 */

export const ORG_ID = `${site.url}/#organization`;
export const SITE_ID = `${site.url}/#website`;

const pageId = (path: string) => `${site.url}${path}#webpage`;

/** US postal abbreviations are what schema.org consumers expect for areaServed. */
function stateNode(state: TitleBondState) {
  return {
    "@type": "State",
    name: state.name,
    alternateName: state.abbr,
    address: { "@type": "PostalAddress", addressRegion: state.abbr, addressCountry: "US" },
  };
}

/**
 * Answers are paragraphs and bullet lists. Joining them naively runs the last
 * word of a paragraph into the first bullet, which is exactly the text an
 * answer engine would quote, so separate the blocks properly.
 */
export function answerToText(blocks: AnswerBlock[]): string {
  return blocks
    .map((block) => (Array.isArray(block) ? block.join(" • ") : block))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function organizationNode() {
  return {
    "@type": ["InsuranceAgency", "Organization"],
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    description: site.description,
    logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "Country", name: "United States" },
    knowsAbout: [
      "Certificate of title bonds",
      "Bonded titles",
      "Lost vehicle titles",
      "Defective vehicle titles",
      "Surety bonds",
      "DMV title requirements",
    ],
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

function webPageNode({
  path,
  name,
  description,
  dateModified,
}: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": pageId(path),
    url: `${site.url}${path}`,
    name,
    description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-US",
    ...(dateModified ? { dateModified } : {}),
  };
}

export function faqNode(faqs: StateFaq[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${site.url}${path}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: answerToText(faq.a) },
    })),
  };
}

/**
 * Parse a leading number out of a rate or premium string, e.g. "1.5%" or
 * "$100". Returns undefined when the value carries qualifiers we can't express
 * numerically — a wrong price in structured data is worse than none.
 */
function parseAmount(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/^\$?([\d,]+(?:\.\d+)?)\s*%?$/);
  if (!match) return undefined;
  const parsed = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function stateServiceNode(state: TitleBondState) {
  const path = `/state/${state.slug}`;
  const minPremium = parseAmount(state.rates.minPremium);
  const rate = parseAmount(state.rates.rate);

  return {
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name: `${state.name} Certificate of Title Bond`,
    serviceType: "Certificate of title surety bond",
    description: stateAnswerText(state),
    provider: { "@id": ORG_ID },
    areaServed: stateNode(state),
    audience: {
      "@type": "Audience",
      audienceType: `${state.name} vehicle owners with a lost, stolen, damaged or defective title`,
    },
    ...(minPremium !== undefined && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: minPremium,
          priceCurrency: "USD",
          description: rate !== undefined
            ? `${state.rates.minPremium} minimum premium, or ${rate}% of the bond amount, whichever is greater.`
            : `${state.rates.minPremium} minimum premium.`,
        },
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

/** The universal three-step process, stated per state so it can be quoted. */
export function howToNode(state: TitleBondState) {
  const path = `/state/${state.slug}`;
  return {
    "@type": "HowTo",
    "@id": `${site.url}${path}#howto`,
    name: `How to get a bonded title in ${state.name}`,
    description: `The three steps to replace a lost, stolen, damaged or defective vehicle title in ${state.name} with a certificate of title bond.`,
    totalTime: "PT10M",
    supply: [
      { "@type": "HowToSupply", name: "Your name and address" },
      { "@type": "HowToSupply", name: "Vehicle year, make and model" },
      { "@type": "HowToSupply", name: "Vehicle VIN or serial number" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Tell us about your vehicle",
        text: "Provide your name and address, plus the year, make, model and VIN or serial number of the vehicle.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Get your bond amount",
        text: state.rates.amountRequired
          ? `In ${state.name} the bond amount is ${state.rates.amountRequired}, as determined by the ${state.agency}.`
          : `The ${state.agency} determines your required bond amount.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Pay and file your bond",
        text: `Most bonds are issued the same day. Sign the original documents and file them with the ${state.agency}.`,
      },
    ],
  };
}

export function breadcrumbNode(
  crumbs: Array<{ name: string; path: string }>,
  path: string,
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${site.url}${path}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

/** Definitions give answer engines a clean entity to attach the topic to. */
export function definedTermsNode() {
  const terms: Array<[string, string, string]> = [
    [
      "Title bond",
      "A certificate of title bond is a surety bond filed with a state motor vehicle agency in place of an original vehicle title, allowing the owner to obtain a bonded title and register the vehicle.",
      "title-bond",
    ],
    [
      "Bonded title",
      "A bonded title is a vehicle title issued on the strength of a surety bond when the owner cannot produce the original title. It carries the same ownership rights as a standard title and typically converts to a clear title after the bond term ends.",
      "bonded-title",
    ],
    [
      "Defective title",
      "A defective vehicle title is a title that is invalid because of unresolved liens, judgments, missing signatures or incorrect information, preventing a clear transfer of ownership.",
      "defective-title",
    ],
  ];

  return {
    "@type": "DefinedTermSet",
    "@id": `${site.url}/frequently-asked-questions#terms`,
    name: "Title bond terminology",
    hasDefinedTerm: terms.map(([name, description, slug]) => ({
      "@type": "DefinedTerm",
      "@id": `${site.url}/frequently-asked-questions#${slug}`,
      name,
      description,
      inDefinedTermSet: { "@id": `${site.url}/frequently-asked-questions#terms` },
    })),
  };
}

export function articleNode(post: Post) {
  const path = `/${post.slug}`;
  return {
    "@type": "Article",
    "@id": `${site.url}${path}#article`,
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": pageId(path) },
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en-US",
  };
}

/**
 * Wrap page-specific nodes into a linked graph.
 *
 * The organization and website nodes are emitted once by the root layout and
 * referenced here by @id, rather than restated on every page — same resolved
 * graph for a consumer, a kilobyte less HTML on each of the 52 pages.
 */
export function graph({
  path,
  name,
  description,
  dateModified,
  nodes = [],
}: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
  nodes?: object[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [webPageNode({ path, name, description, dateModified }), ...nodes],
  };
}

/** An index page that lists things — states, posts — as an extractable list. */
export function collectionNode({
  path,
  items,
}: {
  path: string;
  items: Array<{ name: string; path: string; description?: string }>;
}) {
  return {
    "@type": "ItemList",
    "@id": `${site.url}${path}#list`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${site.url}${item.path}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
