import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * Block indexing on any host that is not the canonical domain.
   *
   * The page-level robots meta is decided at build time, so once titlebonds.us
   * is attached every deployment renders as indexable, including the
   * .vercel.app alias and every preview. This is evaluated per request against
   * the actual Host header, so only the real domain is ever indexable and the
   * build-time flag cannot get this wrong.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: "titlebonds.us" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // The admin lists customers' names, phone numbers and VINs. Unlike the
        // rule above this one has no host condition: there is no deployment,
        // canonical or otherwise, on which these pages should be indexable.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // The legacy WordPress site used inconsistent state slugs. Those exact
      // URLs are preserved verbatim in content/states so rankings carry over;
      // these redirects catch the plausible variants people and old internal
      // links guess at, so nothing lands on a 404.
      { source: "/state/alabama-title-bonds", destination: "/state/alabama-title-bond", permanent: true },
      { source: "/state/iowa-title-bonds", destination: "/state/iowa", permanent: true },
      { source: "/state/missouri-title-bonds", destination: "/state/missouri", permanent: true },
      { source: "/state/nevada-title-bonds", destination: "/state/nevada", permanent: true },
      // Legacy aliases.
      // Posts live at root-level slugs (as they did on WordPress); catch the
      // /blog/<slug> form in case anything links to it.
      { source: "/blog/:slug", destination: "/:slug", permanent: true },
      { source: "/states", destination: "/choose-your-state", permanent: true },
    ];
  },
};

export default nextConfig;
