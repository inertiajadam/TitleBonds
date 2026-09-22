import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formattedAddress } from "@/lib/site";

/**
 * The public site's chrome.
 *
 * It lives in this group rather than the root layout so that /lp pages, which
 * sit outside it, get the document shell, the fonts and the analytics without
 * the navigation. On a paid landing page every link that is not the form or
 * the phone number is a way to leave before converting.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <span className="sr-only">{formattedAddress}</span>
    </>
  );
}
