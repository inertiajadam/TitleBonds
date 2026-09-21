import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyButton } from "@/components/ApplyButton";
import { FaqItem } from "@/components/Faq";
import { Section, SectionHeading } from "@/components/Section";
import { Steps } from "@/components/Steps";
import { StateAnswer, stateAnswerText } from "@/components/StateAnswer";
import { site } from "@/lib/site";
import { getAllStates, getState, getStateSlugs } from "@/lib/states";
import { statePhoto } from "@/lib/photos";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbNode,
  faqNode,
  graph,
  howToNode,
  stateServiceNode,
} from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getStateSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const state = getState(slug);
  if (!state) return {};

  return {
    title: state.seoTitle,
    description: state.metaDescription,
    alternates: { canonical: `/state/${state.slug}` },
    openGraph: {
      title: state.seoTitle,
      description: state.metaDescription,
      url: `/state/${state.slug}`,
    },
  };
}

const rateLabels: Array<[keyof NonNullable<ReturnType<typeof getState>>["rates"], string]> = [
  ["noCreditCheckUpTo", "No credit check up to"],
  ["minPremium", "Minimum premium"],
  ["rate", "Rate"],
  ["instantIssueUpTo", "Instant issue up to"],
  ["amountRequired", "Bond amount required"],
];

export default async function StatePage({ params }: Params) {
  const { slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  const photo = statePhoto(state.slug);
  const others = getAllStates().filter((item) => item.slug !== state.slug);
  const rateRows = rateLabels.filter(([key]) => state.rates[key]);

  const path = `/state/${state.slug}`;
  const pageGraph = graph({
    path,
    name: state.seoTitle,
    description: state.metaDescription,
    nodes: [
      stateServiceNode(state),
      howToNode(state),
      faqNode(state.faqs, path),
      breadcrumbNode(
        [
          { name: "Home", path: "" },
          { name: "Choose Your State", path: "/choose-your-state" },
          { name: state.name, path },
        ],
        path,
      ),
    ],
  });

  return (
    <>
      <div className="relative isolate overflow-hidden bg-navy-950 text-white">
        {/* Decorative — the heading says what the page is about, so describing
            the photograph would only add noise for a screen reader.

            Below lg the masthead is tall and narrow, and a full-bleed cover
            crop of a landscape photo there shows a thin slice out of its
            middle. So the photo takes a band across the top at close to its
            own proportions, where the whole composition is legible, and the
            copy sits on solid navy underneath it rather than fighting a scrim
            for contrast. From lg it goes back to a full backdrop, because the
            rate card is beside the copy by then and covers that half. */}
        <div className="absolute inset-x-0 top-0 h-56 sm:h-72 lg:inset-0 lg:h-auto">
          <Image
            src={photo.src}
            alt=""
            priority
            placeholder="blur"
            sizes="100vw"
            className="size-full object-cover object-center"
          />
          {/* Settles the band onto the content block with no hard edge. */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/15 via-navy-950/20 to-navy-950 lg:hidden" />
        </div>

        <div className="absolute inset-0 hidden bg-gradient-to-r from-navy-950 via-navy-950/88 to-navy-950/30 lg:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-navy-950 via-transparent to-navy-950/45 lg:block" />

        <div className="relative mx-auto max-w-6xl px-4 pt-60 pb-16 sm:pt-80 sm:pb-20 lg:py-16 xl:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-navy-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/choose-your-state" className="hover:text-white">
              Choose Your State
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{state.name}</span>
          </nav>

          <div className="mt-6 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Get your {state.name} title bond today
              </h1>
              <StateAnswer state={state} />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-navy-200">
                {state.intro.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <ApplyButton stateName={state.name}>
                  Get your {state.name} title bond instantly
                </ApplyButton>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center rounded-full px-6 py-3.5 font-semibold text-white ring-1 ring-navy-600 transition-colors hover:bg-navy-900"
                >
                  Call {site.phone}
                </a>
              </div>
            </div>

            {rateRows.length > 0 && (
              <aside className="rounded-card bg-white p-7 text-navy-900 shadow-lg">
                <h2 className="text-lg font-bold">
                  {state.name} title bond rates &amp; requirements
                </h2>
                <dl className="mt-5 divide-y divide-navy-100">
                  {rateRows.map(([key, label]) => (
                    <div key={key} className="flex justify-between gap-6 py-3">
                      <dt className="shrink-0 text-navy-600">{label}</dt>
                      <dd className="tnum min-w-0 text-right font-semibold text-balance">
                        {state.rates[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm text-navy-500">
                  Issued by the {state.agency}
                  {state.statute ? ` under ${state.statute}` : ""}.
                </p>
              </aside>
            )}
          </div>
        </div>
      </div>

      {state.bondAmountTable && (
        <Section>
          <SectionHeading
            title={
              state.bondAmountTable.caption ??
              `Bond amount required for a title bond in ${state.name}`
            }
          />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200">
                  {state.bondAmountTable.columns.map((column) => (
                    <th key={column} className="py-3 pr-4 font-semibold text-navy-950">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.bondAmountTable.rows.map((row) => (
                  <tr key={row[0]} className="border-b border-navy-100">
                    {row.map((cell, index) => (
                      <td
                        key={index}
                        className={
                          index === 0
                            ? "py-3 pr-4 font-medium text-navy-900"
                            : "tnum py-3 pr-4 text-navy-600"
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {state.bondAmountTable.notes && (
            <div className="mt-5 space-y-2 text-sm text-navy-500">
              {state.bondAmountTable.notes.map((note, index) => (
                <p key={index}>{note}</p>
              ))}
            </div>
          )}
        </Section>
      )}

      <Section className={state.bondAmountTable ? "!pt-0" : ""}>
        <SectionHeading
          eyebrow="How it works"
          title={`Getting bonded in ${state.name}`}
          description="Don't overpay. Apply today and get your title bond in three simple steps."
          centered
        />
        <div className="mt-12">
          <Steps />
        </div>
      </Section>

      <div className="bg-navy-50/60">
        <Section>
          <SectionHeading
            eyebrow="Common questions"
            title={`${state.name} title bond questions`}
            centered
          />
          <div className="mx-auto mt-10 max-w-3xl">
            {state.faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </Section>
      </div>

      <Section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-navy-950">
          Ready to replace your {state.name} title?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-600">
          Apply online for a quick decision, or call our bond experts if you want
          help before you start.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ApplyButton stateName={state.name} />
          <a
            href={site.phoneHref}
            className="inline-flex items-center rounded-full px-6 py-3.5 font-semibold text-navy-800 ring-1 ring-navy-200 transition-colors hover:bg-navy-50"
          >
            {site.phone}
          </a>
        </div>
      </Section>

      <Section className="!pt-0">
        <h2 className="text-sm font-semibold tracking-wide text-navy-500 uppercase">
          Title bonds in other states
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/state/${item.slug}`}
                className="inline-block rounded-full border border-navy-100 px-4 py-1.5 text-sm text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <JsonLd data={pageGraph} />
    </>
  );
}
