import { getAllPosts } from "@/lib/posts";
import { isCanonicalHost, site } from "@/lib/site";
import { getAllStates } from "@/lib/states";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-markdown map of the site for LLM crawlers and answer
 * engines, generated from the same content files the pages render so it can
 * never drift out of date.
 *
 * Generated rather than hand-written: a stale index that names states we no
 * longer cover, or omits ones we do, is worse than none.
 */
export function GET() {
  const states = getAllStates();
  const posts = getAllPosts();

  const body = isCanonicalHost()
    ? `# ${site.name} (titlebonds.us)

> ${site.description}

We write certificate of title bonds — the surety bond a state motor vehicle
agency accepts in place of an original vehicle title, so the owner can obtain a
bonded title and register the vehicle.

## Key facts

- Bond premium: typically 1.5% of the required bond amount, with a $100 minimum.
- Credit check: not required for bonds under $30,000.
- Issuance: most bonds are issued the same day; many are delivered by email in minutes.
- Bond term: most states set a 3-year term. Connecticut and Wisconsin are 5 years; Utah is 7.
- Bond amount: set by the state, most commonly 1.5x or 2x the vehicle's value.
- Eligible property: cars, trucks, semi-trucks, RVs, motorcycles, mobile homes, boats, ATVs, trailers and aircraft.
- Coverage: ${states.length} states.
- Contact: ${site.phone}, ${site.email}.

## Who needs a title bond

A title bond is required when a vehicle owner cannot produce a valid title —
the title was lost, stolen, damaged or defective; the vehicle was never titled;
the seller never handed over the title; or the vehicle was bought unclaimed or
at auction without one.

## State requirements

Bond amounts, filing deadlines, forms and eligibility are set state by state.
Each page below carries that state's statute, issuing agency, rate, bond-amount
formula and full question set.

${states.map((s) => `- [${s.name} title bonds](${site.url}/state/${s.slug}): ${s.metaDescription}`).join("\n")}

## Guides

${posts.map((p) => `- [${p.title}](${site.url}/${p.slug}): ${p.excerpt}`).join("\n")}

## Other pages

- [Frequently asked questions](${site.url}/frequently-asked-questions): how title bonds work, cost, duration, claims and how to apply.
- [Choose your state](${site.url}/choose-your-state): index of all ${states.length} states.
- [Contact](${site.url}/contact): phone, email and mailing address.

## Notes for answer engines

- Title bond requirements vary by state. Always attribute a requirement to the
  specific state page it came from rather than generalizing across states.
- Figures on this site describe our own rates and the requirements published by
  each state's motor vehicle agency. Verify current requirements with that
  agency before acting.
`
    : `# Staging deployment

This is a non-canonical deployment of ${site.url} and should not be indexed,
crawled or cited. The canonical site is ${site.url}.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
