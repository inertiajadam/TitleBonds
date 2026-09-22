import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { isCanonicalHost, isProductionDeployment, site } from "@/lib/site";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Clarity } from "@/components/Clarity";
import { ConversionEvents } from "@/components/ConversionEvents";
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

/**
 * Analytics loads on the canonical production host only.
 *
 * Preview deployments share the same code, and sending their traffic to the
 * same property would quietly mix our own testing into the client's numbers.
 * Unset measurement ID means nothing loads at all, which is the correct
 * behaviour for a fork or a local run rather than something to work around.
 */
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const analyticsEnabled = isProductionDeployment();

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
        {children}
        <JsonLd data={siteGraph} />
        {analyticsEnabled && measurementId && (
          <>
            <GoogleAnalytics gaId={measurementId} />
            <ConversionEvents />
          </>
        )}
        {analyticsEnabled && clarityId && <Clarity projectId={clarityId} />}
      </body>
    </html>
  );
}
