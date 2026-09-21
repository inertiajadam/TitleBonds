import type { Metadata } from "next";
import { ApplyButton } from "@/components/ApplyButton";
import { FaqItem } from "@/components/Faq";
import { Section, SectionHeading } from "@/components/Section";
import { bondComparison, fullFaqs } from "@/content/faqs";
import { JsonLd } from "@/components/JsonLd";
import { definedTermsNode, faqNode, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Title Bonds for Lost, Damaged, Stolen & Defective Titles - FAQs",
  description:
    "Answers to the most common questions about title bonds: how they work, who needs one, how much they cost, how long they last and how to apply.",
  alternates: { canonical: "/frequently-asked-questions" },
};

const PATH = "/frequently-asked-questions";

const pageGraph = graph({
  path: PATH,
  name: "Title Bonds for Lost, Damaged, Stolen & Defective Titles - FAQs",
  description:
    "Answers to the most common questions about title bonds: how they work, who needs one, how much they cost, how long they last and how to apply.",
  nodes: [faqNode(fullFaqs, PATH), definedTermsNode()],
});

export default function FaqPage() {
  return (
    <>
      <Section width="prose">
        <SectionHeading
          eyebrow="Frequently asked questions"
          title="Answers to all of your questions about title bonds"
          description="If you've lost the title to your vehicle or lack proper ownership documentation, you may need a title bond to obtain a legal title. Below are the most common questions about how they work."
        />

        <div className="mt-8 rounded-card border-l-4 border-amber-accent bg-amber-accent/10 p-5">
          <p className="text-sm leading-relaxed text-navy-800">
            <strong className="font-semibold">Important:</strong> Title bond
            requirements vary by state. While this guide provides general
            information, be sure to check your state&apos;s specific regulations
            before applying for a bonded title.
          </p>
        </div>

        <div className="mt-10">
          {fullFaqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950">
            How does a title bond compare to other vehicle-related bonds?
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-lg border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200">
                  <th className="py-3 pr-4 font-semibold text-navy-950">Bond type</th>
                  <th className="py-3 pr-4 font-semibold text-navy-950">Purpose</th>
                  <th className="py-3 font-semibold text-navy-950">Who needs it?</th>
                </tr>
              </thead>
              <tbody>
                {bondComparison.map((row) => (
                  <tr key={row.type} className="border-b border-navy-100">
                    <td className="py-3 pr-4 font-medium text-navy-900">{row.type}</td>
                    <td className="py-3 pr-4 text-navy-600">{row.purpose}</td>
                    <td className="py-3 text-navy-600">{row.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed text-navy-600">
            While title bonds help individuals prove ownership, lienholder and
            registration bonds are typically used by businesses or financial
            institutions.
          </p>
        </div>

        <div className="mt-14 rounded-card bg-navy-950 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Still have questions?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-200">
            A title bond is a simple and effective way to obtain legal ownership
            of a vehicle when a title is missing or incomplete.
          </p>
          <div className="mt-7">
            <ApplyButton>Apply Now</ApplyButton>
          </div>
        </div>
      </Section>

      <JsonLd data={pageGraph} />
    </>
  );
}
