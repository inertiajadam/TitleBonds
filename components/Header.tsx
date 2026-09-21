"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { ApplyButton } from "./ApplyButton";

const nav = [
  { href: "/", label: "Home" },
  { href: "/choose-your-state", label: "Choose Your State" },
  { href: "/frequently-asked-questions", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <div className="bg-navy-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-sm">
          <span className="hidden sm:inline">Call a title bond expert today!</span>
          <a href={site.phoneHref} className="font-semibold underline-offset-4 hover:underline">
            {site.phone}
          </a>
        </div>
      </div>

      <div className="border-b border-navy-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-navy-800 text-sm font-bold text-white">
              TB
            </span>
            <span className="text-lg font-bold tracking-tight text-navy-900">
              Title Bond <span className="text-navy-500">Agency</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-navy-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ApplyButton className="hidden px-5 py-2.5 text-sm sm:inline-flex">
              Apply Now
            </ApplyButton>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
              className="rounded-md p-2 text-navy-800 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6">
                {open ? (
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-b border-navy-100 bg-white lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-navy-50 py-3 text-navy-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
