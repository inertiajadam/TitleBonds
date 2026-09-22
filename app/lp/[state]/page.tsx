import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { QuoteForm } from "@/components/QuoteForm";
import { Steps } from "@/components/Steps";
import { getPhoto } from "@/lib/photos";
import { formattedAddress, site } from "@/lib/site";
import { getState, getStateSlugs } from "@/lib/states";
import { stateAnswerText } from "@/components/StateAnswer";

/**
 * Paid search landing pages, one per state, deliberately separate from
 * /state/[slug].
 *
 * The state pages earn the organic clicks and must not be experimented on;
 * these exist to be rewritten, split-tested and thrown away. They carry no
 * navigation, because every link that is not the form is a way to leave, and
 * they are noindex so the two never compete in the same auction.
 */

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
    title: `${state.name} Bonded Title Quote`,
    description: `Get a ${state.name} bonded title quote. ${state.rates.minPremium ?? ""} minimum, most bonds issued the same day.`,
    // Never indexed: these duplicate the state pages by design.
    robots: { index: false, follow: false },
    alternates: {},
  };
}

export default async function LandingPage({ params }: Params) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  const photo = getPhoto(state.image);
  const { minPremium, rate, noCreditCheckUpTo, instantIssueUpTo, amountRequired } = state.rates;

  const proof = [
    minPremium && rate ? `From ${minPremium} or ${rate.replace(/ \(.*\)$/, "")}` : null,
    noCreditCheckUpTo ? `No credit check under ${noCreditCheckUpTo}` : null,
    "Most bonds issued same day",
  ].filter(Boolean) as string[];

  const rows = [
    ["Minimum premium", minPremium],
    ["Rate", rate],
    ["No credit check up to", noCreditCheckUpTo],
    ["Instant issue up to", instantIssueUpTo],
    ["Bond amount required", amountRequired],
  ].filter(([, value]) => value) as Array<[string, string]>;

  return (
    <div className="pb-20 lg:pb-0">
      {/* No navigation: the only ways out are the form and the phone. */}
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <span className="flex items-center gap-2.5">
            <Logo className="size-8 shrink-0" />
            <span className="text-base font-bold tracking-tight text-navy-900">
              The Title Bond <span className="text-navy-500">Agency</span>
            </span>
          </span>
          <a
            href={site.phoneHref}
            data-track-location="lp_header"
            className="text-sm font-bold text-navy-900 sm:text-base"
          >
            {site.phone}
          </a>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image
          src={photo.src}
          alt=""
          priority
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-950/80 lg:to-navy-950/40" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[1.1fr_auto] lg:items-start lg:gap-14">
          <div>
            <h1 className="text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-5xl">
              Get a bonded title in {state.name}
            </h1>
            {/* The state page leads with the full extractable answer, which is
                right for an answer engine and wrong here: eleven lines of it
                pushed the form most of a screen further down. Paid visitors
                already know what they came for, so this keeps the sentence
                carrying the price and lets the chips do the rest. */}
            <p className="mt-4 text-lg leading-relaxed text-navy-100">
              {stateAnswerText(state).split(/(?<=\.)\s/)[0]}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {proof.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/20"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div id="quote" className="w-full scroll-mt-4 lg:w-[27rem]">
            <QuoteForm stateName={state.name} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
          Three steps to your {state.name} bonded title
        </h2>
        <div className="mt-10">
          <Steps />
        </div>
      </section>

      {rows.length > 0 && (
        <section className="bg-navy-50/60">
          <div className="mx-auto max-w-3xl px-4 py-14">
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              {state.name} rates and requirements
            </h2>
            <dl className="mt-6 divide-y divide-navy-200 rounded-card bg-white px-6 shadow-sm">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3.5">
                  <dt className="shrink-0 text-navy-600">{label}</dt>
                  <dd className="tnum min-w-0 text-right font-semibold text-balance text-navy-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-navy-500">
              Issued by the {state.agency}
              {state.statute ? ` under ${state.statute}` : ""}.
            </p>
          </div>
        </section>
      )}

      {state.faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950">
            {state.name} bonded title questions
          </h2>
          <dl className="mt-8 space-y-7">
            {state.faqs.slice(0, 4).map((faq) => (
              <div key={faq.q}>
                <dt className="font-bold text-navy-950">{faq.q}</dt>
                {faq.a.map((block, index) =>
                  Array.isArray(block) ? (
                    <dd key={index} className="mt-2">
                      <ul className="ml-5 list-disc space-y-1.5 text-navy-700">
                        {block.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  ) : (
                    <dd key={index} className="mt-2 leading-relaxed text-navy-700">
                      {block}
                    </dd>
                  ),
                )}
              </div>
            ))}
          </dl>
        </section>
      )}

      <footer className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-navy-600">
          <p className="font-semibold text-navy-900">{site.name}</p>
          <p className="mt-2">{formattedAddress}</p>
          <p className="mt-2">
            <a href={site.phoneHref} data-track-location="lp_footer" className="font-semibold">
              {site.phone}
            </a>
          </p>
          <p className="mt-4 text-xs text-navy-500">
            {site.name} &copy; {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* The measured problem on the state pages was a CTA 1,433px down on a
          phone. This keeps both actions reachable at every scroll position. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-navy-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <a
          href={site.phoneHref}
          data-track-location="lp_sticky"
          className="flex flex-1 items-center justify-center rounded-full px-4 py-3 font-semibold text-navy-900 ring-1 ring-navy-300"
        >
          Call
        </a>
        <a
          href="#quote"
          className="flex flex-[1.4] items-center justify-center rounded-full bg-amber-accent px-4 py-3 font-semibold text-navy-950"
        >
          Get my quote
        </a>
      </div>
    </div>
  );
}
