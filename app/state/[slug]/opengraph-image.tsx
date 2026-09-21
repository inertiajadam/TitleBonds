import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getState, getStateSlugs } from "@/lib/states";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "State title bond rates and requirements";

export function generateStaticParams() {
  return getStateSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = getState(slug);

  const facts = [
    state?.rates.rate && `Rate ${state.rates.rate.replace(/ \(.*\)$/, "")}`,
    state?.rates.minPremium && `From ${state.rates.minPremium}`,
    state?.rates.noCreditCheckUpTo &&
      `No credit check under ${state.rates.noCreditCheckUpTo}`,
  ].filter((fact): fact is string => Boolean(fact));

  return renderOgImage({
    eyebrow: `${state?.name ?? ""} title bonds`,
    title: `Get your ${state?.name ?? ""} title bond today`,
    facts,
    photo: state?.image,
  });
}
