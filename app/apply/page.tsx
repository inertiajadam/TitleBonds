import type { Metadata } from "next";
import { StateSelect } from "@/components/StateSelect";
import { getAllStates } from "@/lib/states";

export const metadata: Metadata = {
  title: "Apply for a title bond",
  robots: { index: false, follow: false },
};

/**
 * The bond a customer needs depends entirely on their state, so the flow asks
 * that before anything else rather than collecting details it might have to
 * throw away.
 */
export default function ApplyIndexPage() {
  const states = getAllStates().map(({ slug, name }) => ({ slug, name }));

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy-950">
        Apply for a certificate of title bond
      </h1>
      <p className="mt-3 text-navy-700">
        Bond amounts are set by your state, so start by telling us where the
        vehicle will be titled.
      </p>

      <div className="mt-8 rounded-card bg-navy-900 p-6">
        <StateSelect
          states={states}
          basePath="/apply"
          label="Select your state"
          buttonLabel="Start application"
        />
      </div>

      <p className="mt-6 text-sm text-navy-600">
        We write bonds in the {states.length} states listed. If yours is not
        here, call us and we will tell you where to go.
      </p>
    </main>
  );
}
