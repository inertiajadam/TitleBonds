import Link from "next/link";
import { formattedAddress, site } from "@/lib/site";
import { getAllStates } from "@/lib/states";

export function Footer() {
  const states = getAllStates();

  return (
    <footer className="mt-24 bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-white">{site.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-200">
              Get the best rates for your lost, stolen or damaged title bond
              today. Title bonds available for cars, trucks, trailers, aircraft
              and more.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/choose-your-state", label: "Choose Your State" },
                { href: "/frequently-asked-questions", label: "Frequently Asked Questions" },
                { href: "/blog", label: "Industry News" },
                { href: "/contact", label: "Contact Us" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-navy-200 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">
              Contact
            </p>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-navy-200">
              <p>{formattedAddress}</p>
              <p>
                Call us:{" "}
                <a href={site.phoneHref} className="font-semibold text-white hover:underline">
                  {site.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${site.email}`} className="text-white hover:underline">
                  {site.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-800 pt-8">
          <p className="text-sm font-semibold text-white">Title bonds by state</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {states.map((state) => (
              <li key={state.slug}>
                <Link
                  href={`/state/${state.slug}`}
                  className="text-navy-300 transition-colors hover:text-white"
                >
                  {state.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 border-t border-navy-800 pt-8 text-xs text-navy-400">
          {site.name} &copy; {new Date().getFullYear()}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
