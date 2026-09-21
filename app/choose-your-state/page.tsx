import Link from "next/link";
import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { StateSelect } from "@/components/StateSelect";
import { getAllStates } from "@/lib/states";

export const metadata: Metadata = {
  title: "Choose Your State",
  description:
    "Title bond rates, bond amounts and DMV requirements for every state we write certificate of title bonds in. Select your state to get started.",
  alternates: { canonical: "/choose-your-state" },
};

export default function ChooseYourStatePage() {
  const states = getAllStates();

  return (
    <Section>
      <SectionHeading
        eyebrow="Choose your state"
        title="Title bond rates & requirements by state"
        description="Bond amounts, filing steps and DMV forms are set state by state. Select yours for the details that apply to you."
      />

      <div className="mt-8 max-w-xl">
        <StateSelect states={states} buttonLabel="View requirements" />
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((state) => (
          <li key={state.slug}>
            <Link
              href={`/state/${state.slug}`}
              className="block h-full rounded-card border border-navy-100 p-6 transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <p className="text-lg font-bold text-navy-950">{state.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {state.rates.rate ? `Rate ${state.rates.rate}` : "Competitive rates"}
                {state.rates.minPremium ? ` · Minimum ${state.rates.minPremium}` : ""}
              </p>
              <p className="mt-3 text-sm font-semibold text-navy-600">
                View {state.name} requirements &rarr;
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
