import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

/**
 * The application flow sits outside the (site) group for the same reason the
 * landing pages do: every link that is not the next step is a way to leave
 * half way through an application. The header keeps the wordmark and the phone
 * number and nothing else, because someone who gets stuck should be able to
 * call rather than abandon.
 *
 * Noindex while incomplete. The payment step is not wired up yet, so this must
 * not start collecting search traffic that cannot finish.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-50">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" aria-label={site.name}>
            <Logo className="h-8 w-auto" />
          </Link>
          <a
            href={site.phoneHref}
            data-track="phone_click"
            data-track-location="apply_header"
            className="text-sm font-semibold text-navy-800 hover:text-navy-950"
          >
            {site.phone}
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
