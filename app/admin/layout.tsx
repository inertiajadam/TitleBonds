import type { Metadata } from "next";

/**
 * The admin sits outside the (site) route group so it inherits none of the
 * marketing chrome: no nav to the state pages, no footer full of links, no
 * apply button. It is a different product that happens to share a domain.
 */
export const metadata: Metadata = {
  title: "Leads",
  // Belt and braces with the X-Robots-Tag header in next.config.ts. This page
  // lists real people's phone numbers; it should never be reachable by search.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-navy-50">{children}</div>;
}
