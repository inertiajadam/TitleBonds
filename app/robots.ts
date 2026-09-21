import type { MetadataRoute } from "next";
import { isCanonicalHost, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isCanonicalHost()) {
    // Staging and preview hosts: keep the duplicate out of the index.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
