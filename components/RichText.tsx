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
 * else leaves the site and is marked nofollow, which is a deliberate editorial
 * choice rather than a default: these cite statutes and agencies, and the
 * citation is for the reader.
 */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

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
          rel="nofollow noopener noreferrer"
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
