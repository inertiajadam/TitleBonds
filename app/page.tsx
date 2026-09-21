import Link from "next/link";
import type { Metadata } from "next";
import { ApplyButton } from "@/components/ApplyButton";
import { FaqItem } from "@/components/Faq";
import { Section, SectionHeading } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { Steps } from "@/components/Steps";
import { TrustBar } from "@/components/TrustBar";
import { getRecentPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { getAllStates } from "@/lib/states";
import { homepageFaqs } from "@/content/faqs";
import { JsonLd } from "@/components/JsonLd";
import { faqNode, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: `${site.name} | Lost, Stolen & Damaged Title Bonds`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const states = getAllStates();
  const posts = getRecentPosts(3);

  const pageGraph = graph({
    path: "",
    name: `${site.name} | Lost, Stolen & Damaged Title Bonds`,
    description: site.description,
    nodes: [faqNode(homepageFaqs, "")],
  });

  return (
    <>
      <Hero states={states} />

      <Section className="!py-14">
        <TrustBar />
      </Section>

      <Section className="!pt-0">
        <SectionHeading
          eyebrow="How it works"
          title="Get your title bond in 3 simple steps"
          description="Our online title bond application takes about two minutes. In many cases your bond is issued the same day."
          centered
        />
        <div className="mt-12">
          <Steps />
        </div>
        <div className="mt-10 text-center">
          <ApplyButton>Apply Now</ApplyButton>
        </div>
      </Section>

      <div className="bg-navy-50/60">
        <Section>
          <SectionHeading
            eyebrow="Common questions"
            title="Common questions about title bonds"
            centered
          />
          <div className="mx-auto mt-10 max-w-3xl">
            {homepageFaqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/frequently-asked-questions"
              className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-950"
            >
              Read all title bond FAQs
            </Link>
          </p>
        </Section>
      </div>

      <Section>
        <SectionHeading
          eyebrow="Get started"
          title="Choose your state to find rates & requirements"
          description="Title bond rules, bond amounts and filing steps are set state by state. Pick yours for the details that apply to you."
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {states.map((state) => (
            <li key={state.slug}>
              <Link
                href={`/state/${state.slug}`}
                className="flex items-center justify-between rounded-lg border border-navy-100 px-4 py-3 text-navy-800 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <span className="font-medium">{state.name}</span>
                <span className="text-xs text-navy-400">{state.abbr}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {posts.length > 0 && (
        <div className="bg-navy-50/60">
          <Section>
            <SectionHeading eyebrow="Industry news" title="Recent title bond news" />
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="rounded-card border border-navy-100 bg-white p-7 shadow-sm"
                >
                  <p className="text-sm text-navy-400">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-navy-950">
                    <Link href={`/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 leading-relaxed text-navy-600">{post.excerpt}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      <JsonLd data={pageGraph} />
    </>
  );
}
