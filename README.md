# titlebonds.us

Marketing site for The Title Bond Agency — a rebuild of the previous WordPress
site as a statically generated Next.js app.

## Stack

- Next.js 16 (App Router) + React 19, TypeScript
- Tailwind CSS v4 (theme tokens in `app/globals.css`)
- No database or CMS — content is JSON on disk, read at build time

Every page is prerendered to static HTML. There are no runtime dependencies yet,
which is what makes the site cheap to host and fast to serve.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prerenders every page
npm run start      # serve the production build
npm run typecheck
```

## URLs are load-bearing

The site's value is organic search, so **every legacy URL is preserved exactly**,
including the inconsistent slugs WordPress left behind:

| Pattern | Examples |
| --- | --- |
| `/state/<slug>` | `/state/texas-title-bonds`, `/state/alabama-title-bond`, `/state/iowa` |
| `/<post-slug>` | `/what-is-a-defective-vehicle-title` (posts live at the root, not under `/blog/`) |
| `/frequently-asked-questions` | long-form FAQ page |

Three states (`iowa`, `missouri`, `nevada`) and Alabama (`alabama-title-bond`)
do not follow the `<state>-title-bonds` convention. That is deliberate. The
plausible variants people guess at are 301'd in `next.config.ts`.

**Do not rename a slug** without adding a permanent redirect from the old one.

## Content

Content is data, not markup, so the client's copy can be edited without touching
components.

```
content/
  states/<slug>.json    32 states: rates, requirements, bond tables, FAQs
  blog/<slug>.json      10 posts, as structured blocks
  faqs.ts               homepage + FAQ page question sets
```

`lib/states.ts` and `lib/posts.ts` read these at build time and **fail the build**
if a file's `slug` field doesn't match its filename — a mismatch would otherwise
404 a page the sitemap still advertises.

Adding a state is one JSON file; `generateStaticParams`, the sitemap, the footer,
the state picker and the "other states" list all pick it up automatically.

### Answer and post blocks

State FAQ answers (`a`) are an array where a string is a paragraph and a nested
array is a bulleted list. Posts use tagged blocks (`p`, `h2`, `h3`, `ul`, `ol`,
`table`). Both render through shared components, so content files never contain
markup.

## The API integration seam

Today every "Apply Now" hands off to A1 Surety Bonds. That handoff is funnelled
through a single function:

```ts
// lib/site.ts
export function applyUrl(stateName?: string): string
```

Nothing else in the codebase links to the partner site. When the instant-issue
surety API lands, this is the function that changes — swap it for a route to an
on-site application flow, and every CTA on all 52 pages follows.

Note that the API work will need server-side route handlers to hold the surety
credentials. Those belong in `app/api/`; credentials go in environment variables
and must never reach the client bundle.

## Deployment

Hosted on Vercel (team `jadam1`, project `titlebonds`), linked to this GitHub
repo — every push to the production branch deploys automatically.

### Indexing is gated to the canonical domain

Preview and `*.vercel.app` builds serve the same content as production. If Google
indexed one, it would put a duplicate of the entire site in competition with
titlebonds.us — the exact thing this rebuild exists to prevent.

So `robots.ts` serves `Disallow: /` and the pages carry `noindex` unless the
deployment is the canonical host. That check (`isCanonicalHost()` in
`lib/site.ts`) compares Vercel's `VERCEL_PROJECT_PRODUCTION_URL` against
`site.url`, so it flips itself on once titlebonds.us is attached as the
production domain — there's no flag to remember.

**These values are read at build time.** Attaching the domain does not rebuild
by itself, so after cutover trigger one deploy (push a commit or redeploy from
the dashboard) and then confirm `https://titlebonds.us/robots.txt` says
`Allow: /`. Until you see that, the live site is telling crawlers to stay out.

## Business details

Phone, email, address and partner links live in `lib/site.ts`. Change them there
— the header, footer, contact page and the `InsuranceAgency` structured data all
read from it.

## Search, answer engines and LLMs

The site is built to be quoted, not just ranked. Three things follow from that.

**Answer first.** Every state page opens with one self-contained paragraph that
answers "what does a title bond cost here and how does it work" outright — price,
bond formula, issuing agency, statute, credit-check threshold. It is generated
from the same structured rates the page renders (`components/StateAnswer.tsx`),
so the prose, the rates card and the `Service` schema can never disagree. Each
clause is dropped when its field is missing rather than guessing.

**One linked entity graph.** `lib/schema.ts` emits a single `@graph` per page
with `@id`-linked nodes. Answer engines resolve entities by `@id` far more
reliably than they infer them from repeated inline blobs. The organization and
website nodes are emitted once in the root layout and referenced everywhere else.

| Page | Nodes |
| --- | --- |
| Sitewide | `InsuranceAgency`/`Organization`, `WebSite` |
| State | `WebPage`, `Service` + `Offer` (priced, `areaServed` the state), `HowTo`, `FAQPage`, `BreadcrumbList` |
| FAQ | `WebPage`, `FAQPage`, `DefinedTermSet` |
| Blog / Choose Your State | `WebPage`, `ItemList`, `BreadcrumbList` |
| Post | `WebPage`, `Article`, `BreadcrumbList` |
| Contact | `WebPage`, `ContactPage`, `BreadcrumbList` |

Prices in `Offer` are parsed conservatively — a value carrying qualifiers we
can't express numerically is omitted, because wrong structured pricing is worse
than none.

**Machine-readable index.** `/llms.txt` is a markdown map of the site for LLM
crawlers, generated from the content files so it cannot go stale. `robots.ts`
names the answer-engine crawlers explicitly (GPTBot, ClaudeBot, PerplexityBot,
Google-Extended, and others) — the wildcard already allows them, but naming them
records that being cited is intended, so a later robots edit doesn't quietly cut
it off.

Also: per-page titles, descriptions and canonicals; `sitemap.xml` generated from
content; and build-time OG images (`lib/og.tsx`) so every one of the 52 pages has
a real preview card.

### Things deliberately not done

- **No `aggregateRating`.** There are no collected reviews. Marking up ratings
  without them is a manual-action risk.
- **No `dateModified` on state pages.** The statutes were last verified in 2023.
  A fresh timestamp would tell search engines the content was reviewed when it
  wasn't.
- **No hosted webfont.** The site uses a system font stack: no render-blocking
  third-party request, no layout shift. Core Web Vitals are a ranking input and
  this site's whole value is organic search. See below before changing it.

## Typography

The site ships with a system font stack. Adobe Fonts candidates were reviewed —
[Attribute Text](https://fonts.adobe.com/fonts/ff-attribute-text) by Viktor Nubel
(FontFont) and [Nexa Text](https://fonts.adobe.com/fonts/nexa) by Plamen Motev and
Nikolay Petroussenko (Fontfabric) are both text-optimized families with weights
through Black; [Akzidenz-Grotesk Next](https://fonts.adobe.com/fonts/akzidenz-grotesk-next)
by Bernd Möllenstädt and Dieter Hofrichter (Monotype) is the other candidate. All
are premium and need an active Adobe Fonts entitlement.

If one is adopted, self-host the woff2 and `preload` it rather than using a
Typekit kit — a kit puts a render-blocking request to a third-party origin on the
critical path of every page.

## Business details