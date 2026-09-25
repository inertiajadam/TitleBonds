"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { slug: string; name: string };

/**
 * The button used to render disabled until a state was picked, which meant the
 * page's primary call to action appeared greyed-out and broken on first paint.
 * The select is marked required instead, so the browser prompts on submit and
 * the button always looks live.
 */
export function StateSelect({
  states,
  label = "Select your state",
  buttonLabel = "Get Started",
  /** Where picking a state sends you. The application flow reuses this. */
  basePath = "/state",
}: {
  states: Option[];
  label?: string;
  buttonLabel?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (slug) router.push(`${basePath}/${slug}`);
      }}
      className="flex w-full flex-col gap-3 sm:flex-row sm:gap-2"
    >
      <label htmlFor="state-select" className="sr-only">
        {label}
      </label>
      <div className="relative flex-1">
        <select
          id="state-select"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full appearance-none rounded-full border-0 bg-white py-4 pr-12 pl-6 text-base font-medium text-navy-900 shadow-lg ring-1 ring-white/10 focus:ring-2 focus:ring-amber-accent focus:outline-none"
        >
          <option value="">{label}</option>
          {states.map((state) => (
            <option key={state.slug} value={state.slug}>
              {state.name}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute top-1/2 right-5 size-5 -translate-y-1/2 text-navy-400"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-full bg-amber-accent px-8 py-4 text-base font-bold text-navy-950 shadow-lg transition-colors hover:bg-amber-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-accent"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
