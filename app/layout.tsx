import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formattedAddress, isCanonicalHost, site } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { organizationNode, websiteNode } from "@/lib/schema";
import "./globals.css";

/**
 * Both families are downloaded and self-hosted at build time by next/font, so
 * there is no request to a third-party font CDN at runtime and no flash of
 * unstyled text — the earlier objection to a webfont was about a hosted kit,
 * which this avoids.
 *
 * Archivo carries the headlines; Inter sets the long regulatory copy, where
 * small-size legibility matters more than personality.
 */
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const text = Inter({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Lost, Stolen & Damaged Title Bonds`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} | Lost, Stolen & Damaged Title Bonds`,
    description: site.description,
  },
  // robots.txt already blocks non-canonical hosts; this also keeps them out
  // of the index if a staging URL is linked to from somewhere else.
  robots: isCanonicalHost()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationNode(), websiteNode()],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={siteGraph} />
        <span className="sr-only">{formattedAddress}</span>
      </body>
    </html>
  );
}
