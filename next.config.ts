import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
