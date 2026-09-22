import Link from "next/link";
import { Fragment } from "react";

/**
 * Inline links inside post copy.
 *
 * Body text is authored as plain strings in JSON, so links are written the way
 * anyone would write them in a text file — [label](href) — and resolved here
 * rather than by pulling in a Markdown renderer for one feature.
 *
 * A href starting with "/" is one of ours and routes client-side. Everything
 * else leaves the site.
 *
 * Government and university sources are followed: they are editorial citations
 * of the agencies and statutes the copy relies on, which is what a link is for.
 * Any other outbound link is nofollow by default, so a commercial link added
 * later does not quietly pass authority just because nobody remembered.
 */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Parse the URL rather than matching on the string: ".gov" appears in
 * evil.gov.example.com too, and only the host's real suffix should count.
 * An href that will not parse is treated as untrusted.
 */
export function isAuthoritativeSource(href: string): boolean {
  try {
    const { hostname } = new URL(href);
    return hostname.endsWith(".gov") || hostname.endsWith(".edu");
  } catch {
    return false;
  }
}

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK)) {
    const [raw, label, href] = match;
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));

    parts.push(
      href.startsWith("/") ? (
        <Link
          key={start}
          href={href}
          className="font-medium text-navy-700 underline underline-offset-2 hover:text-navy-900"
        >
          {label}
        </Link>
      ) : (
        <a
          key={start}
          href={href}
          target="_blank"
          rel={
            isAuthoritativeSource(href)
              ? "noopener noreferrer"
              : "nofollow noopener noreferrer"
          }
          className="font-medium text-navy-700 underline underline-offset-2 hover:text-navy-900"
        >
          {label}
        </a>
      ),
    );
    cursor = start + raw.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
