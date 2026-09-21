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

## SEO

- Per-page `title`/`description`/`canonical` via the Metadata API
- `FAQPage` schema on the homepage, FAQ page and every state page
- `BreadcrumbList` on state pages, `Article` on posts, `InsuranceAgency` sitewide
- `app/sitemap.ts` generates `/sitemap.xml` from the content files
