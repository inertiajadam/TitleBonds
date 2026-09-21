import Link from "next/link";
import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Title Bond News & Guides",
  description:
    "Guides and industry news on certificate of title bonds, bonded titles, and replacing a lost, stolen or defective vehicle title.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Section>
      <SectionHeading
        eyebrow="Industry news"
        title="Title bond news & guides"
        description="Plain-English answers about bonded titles, DMV requirements and what to do when a title goes missing."
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="flex h-full flex-col rounded-card border border-navy-100 p-7 transition-colors hover:border-navy-300"
          >
            <time dateTime={post.date} className="text-sm text-navy-400">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h2 className="mt-3 text-xl font-bold text-navy-950">
              <Link href={`/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-navy-600">{post.excerpt}</p>
            <p className="mt-5">
              <Link
                href={`/${post.slug}`}
                className="font-semibold text-navy-700 hover:underline"
              >
                Read more &rarr;
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
