import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/content/about";
import { ApplyButton } from "@/components/ApplyButton";
import { Section, SectionHeading } from "@/components/Section";
import { Steps } from "@/components/Steps";
import { JsonLd } from "@/components/JsonLd";
import { ORG_ID, breadcrumbNode, graph } from "@/lib/schema";
import { credentials, site } from "@/lib/site";
import { getAllStates } from "@/lib/states";

export const metadata: Metadata = {
  title: "About Us",
  description: about.lead,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const states = getAllStates();
  const path = "/about";

  return (
    <>
      <Section width="prose">
        <h1 className="text-4xl font-bold tracking-tight text-navy-950">
          {about.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-navy-700">{about.lead}</p>

        <div className="mt-10 space-y-5">
          {about.body.map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2
                  key={index}
                  className="pt-6 text-2xl font-bold tracking-tight text-navy-950"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={index} className="ml-5 list-disc space-y-2 text-navy-700">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-lg leading-relaxed text-navy-700">
                {block.text}
              </p>
            );
          })}
        </div>
      </Section>

      {/* Renders only once there are real credentials to show. An empty
          "Our credentials" heading is worse than no heading. */}
      {credentials.length > 0 && (
        <div className="bg-navy-50/60">
          <Section width="prose">
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              Credentials
            </h2>
            <dl className="mt-6 divide-y divide-navy-200 rounded-card bg-white px-6 shadow-sm">
              {credentials.map((item) => (
                <div key={item.label} className="flex justify-between gap-6 py-3.5">
                  <dt className="shrink-0 text-navy-600">{item.label}</dt>
                  <dd className="min-w-0 text-right font-semibold text-balance text-navy-900">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>
      )}

      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="Three steps, whatever the vehicle"
          centered
        />
        <div className="mt-12">
          <Steps />
        </div>
      </Section>

      <div className="bg-navy-50/60">
        <Section>
          <SectionHeading
            eyebrow="Coverage"
            title={`Title bonds in ${states.length} states`}
            description="Each state sets its own bond amount, valuation method and term. Every state page names the agency and statute behind its figures."
            centered
          />
          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
            {states.map((state) => (
              <li key={state.slug}>
                <Link
                  href={`/state/${state.slug}`}
                  className="inline-block rounded-full border border-navy-200 bg-white px-4 py-1.5 text-sm text-navy-700 transition-colors hover:border-navy-400"
                >
                  {state.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-navy-950">
          Talk to a bond expert
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-600">
          If you are not sure whether a bonded title is the right route, call
          and ask. We would rather tell you it is not than sell you a bond that
          cannot help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ApplyButton location="contact" />
          <a
            href={site.phoneHref}
            data-track-location="contact"
            className="inline-flex items-center rounded-full px-6 py-3.5 font-semibold text-navy-800 ring-1 ring-navy-200 transition-colors hover:bg-navy-50"
          >
            {site.phone}
          </a>
        </div>
      </Section>

      <JsonLd
        data={graph({
          path,
          name: about.title,
          description: about.lead,
          nodes: [
            { "@type": "AboutPage", "@id": `${site.url}${path}#about`, mainEntity: { "@id": ORG_ID } },
            breadcrumbNode(
              [
                { name: "Home", path: "" },
                { name: "About", path },
              ],
              path,
            ),
          ],
        })}
      />
    </>
  );
}
