import type { Metadata } from "next";
import { ApplyButton } from "@/components/ApplyButton";
import { Section, SectionHeading } from "@/components/Section";
import { formattedAddress, site } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { ORG_ID, breadcrumbNode, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to a title bond expert. Call (800) 737-4880 or email info@a1suretybonds.com for help with a lost, stolen, damaged or defective vehicle title.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const pageGraph = graph({
    path: "/contact",
    name: "Contact Us",
    description:
      "Talk to a title bond expert. Call (800) 737-4880 or email info@a1suretybonds.com.",
    nodes: [
      {
        "@type": "ContactPage",
        "@id": `${site.url}/contact#contactpage`,
        mainEntity: { "@id": ORG_ID },
      },
      breadcrumbNode(
        [
          { name: "Home", path: "" },
          { name: "Contact", path: "/contact" },
        ],
        "/contact",
      ),
    ],
  });

  return (
    <Section>
      <JsonLd data={pageGraph} />
      <SectionHeading
        eyebrow="Contact us"
        title="Talk to a title bond expert"
        description="Not sure which bond you need, or what your DMV is asking for? Call us and we will walk you through it."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-card border border-navy-100 p-8">
          <h2 className="text-lg font-bold text-navy-950">Call us</h2>
          <a
            href={site.phoneHref}
            data-track-location="contact"
            className="mt-3 inline-block text-3xl font-bold text-navy-700 hover:underline"
          >
            {site.phone}
          </a>
          <p className="mt-4 leading-relaxed text-navy-600">
            Our bond experts can confirm your bond amount, check your state's
            requirements and get your application started over the phone.
          </p>
        </div>

        <div className="rounded-card border border-navy-100 p-8">
          <h2 className="text-lg font-bold text-navy-950">Email us</h2>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 inline-block text-xl font-semibold text-navy-700 hover:underline"
          >
            {site.email}
          </a>
          <h3 className="mt-8 text-lg font-bold text-navy-950">Mailing address</h3>
          <address className="mt-2 leading-relaxed text-navy-600 not-italic">
            {formattedAddress}
          </address>
        </div>
      </div>

      <div className="mt-12 rounded-card bg-navy-950 p-10 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to get bonded?</h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">
          Apply online in about two minutes. Most bonds are issued the same day.
        </p>
        <div className="mt-7">
          <ApplyButton location="contact">Apply Now</ApplyButton>
        </div>
      </div>
    </Section>
  );
}
