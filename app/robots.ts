import type { MetadataRoute } from "next";
import { isCanonicalHost, site } from "@/lib/site";

/**
 * Answer-engine and LLM crawlers are named explicitly rather than left to the
 * wildcard. The wildcard would already allow them, but several of these bots
 * are blocked by default in common hosting templates and boilerplate — naming
 * them records that being cited by these engines is intended, so a future
 * robots.txt edit doesn't quietly cut it off.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "cohere-ai",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  if (!isCanonicalHost()) {
    // Staging and preview hosts: keep the duplicate out of the index.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
