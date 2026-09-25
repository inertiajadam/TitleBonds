import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/apply/ApplicationForm";
import { getBondRule, noFormulaReason } from "@/lib/bond-estimate";
import { getState, getStateSlugs } from "@/lib/states";
import { site } from "@/lib/site";

type Params = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return getStateSlugs().map((state) => ({ state }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};
  return {
    title: `Apply for a ${state.name} title bond`,
    robots: { index: false, follow: false },
  };
}

export default async function ApplyStatePage({ params }: Params) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  // Only the one state's rule crosses to the client, not the whole table.
  const rule = getBondRule(state);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
        {state.name} certificate of title bond
      </h1>
      <p className="mt-2 text-navy-700">
        Filed with the {state.agency}. Most bonds are issued the same day.
      </p>

      <div className="mt-7">
        <ApplicationForm
          stateName={state.name}
          rule={rule}
          noRuleReason={noFormulaReason(state)}
        />
      </div>

      <p className="mt-6 text-center text-sm text-navy-600">
        Stuck, or would rather do this by phone?{" "}
        <a
          href={site.phoneHref}
          data-track="phone_click"
          data-track-location="apply_footer"
          className="font-semibold text-navy-800 underline underline-offset-2"
        >
          Call {site.phone}
        </a>
      </p>
    </main>
  );
}
