import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyButton } from "@/components/ApplyButton";
import { Section } from "@/components/Section";
import { getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.metaDescription,
      url: `/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${site.url}/${post.slug}`,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <Section width="prose">
      <nav aria-label="Breadcrumb" className="text-sm text-navy-500">
        <Link href="/blog" className="hover:text-navy-900">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy-900">{post.title}</span>
      </nav>

      <article className="mt-6">
        <time dateTime={post.date} className="text-sm text-navy-400">
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-950">
          {post.title}
        </h1>

        <div className="mt-10 space-y-5">
          {post.body.map((block, index) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2
                    key={index}
                    className="pt-6 text-2xl font-bold tracking-tight text-navy-950"
                  >
                    {block.text}
                  </h2>
                );
              case "h3":
                return (
                  <h3 key={index} className="pt-4 text-xl font-bold text-navy-950">
                    {block.text}
                  </h3>
                );
              case "ul":
                return (
                  <ul key={index} className="ml-5 list-disc space-y-2 text-navy-700">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                );
              case "ol":
                return (
                  <ol key={index} className="ml-5 list-decimal space-y-2 text-navy-700">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ol>
                );
              case "table":
                return (
                  <div key={index} className="overflow-x-auto">
                    <table className="w-full min-w-lg border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-navy-200">
                          {block.columns.map((column) => (
                            <th key={column} className="py-3 pr-4 font-semibold text-navy-950">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row) => (
                          <tr key={row[0]} className="border-b border-navy-100">
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className={
                                  cellIndex === 0
                                    ? "py-3 pr-4 font-medium text-navy-900"
                                    : "py-3 pr-4 text-navy-600"
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
                );
              default:
                return (
                  <p key={index} className="text-lg leading-relaxed text-navy-700">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>
      </article>

      <div className="mt-14 rounded-card bg-navy-950 p-10 text-center text-white">
        <h2 className="text-2xl font-bold">Need a title bond?</h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">
          Apply online in about two minutes. Rates start at 1.5% and most bonds
          are issued the same day.
        </p>
        <div className="mt-7">
          <ApplyButton>Apply Now</ApplyButton>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </Section>
  );
}
