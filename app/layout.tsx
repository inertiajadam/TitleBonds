import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formattedAddress, isCanonicalHost, site } from "@/lib/site";
import "./globals.css";

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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: site.name,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: "US",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <span className="sr-only">{formattedAddress}</span>
      </body>
    </html>
  );
}
