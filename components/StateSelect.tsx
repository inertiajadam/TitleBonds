"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { slug: string; name: string };

export function StateSelect({
  states,
  label = "Select your state",
  buttonLabel = "Get Started",
}: {
  states: Option[];
  label?: string;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (slug) router.push(`/state/${slug}`);
      }}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="state-select" className="sr-only">
        {label}
      </label>
      <select
        id="state-select"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        className="w-full rounded-full border-0 bg-white px-6 py-3.5 text-base text-navy-900 shadow-sm ring-1 ring-navy-200 focus:ring-2 focus:ring-navy-500 focus:outline-none"
      >
        <option value="">{label}</option>
        {states.map((state) => (
          <option key={state.slug} value={state.slug}>
            {state.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!slug}
        className="shrink-0 rounded-full bg-amber-accent px-8 py-3.5 text-base font-semibold text-navy-950 shadow-sm transition-colors hover:bg-amber-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
