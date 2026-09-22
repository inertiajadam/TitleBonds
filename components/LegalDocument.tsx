import type { LegalDoc } from "@/content/legal";
import { Section } from "@/components/Section";

/** Shared rendering so the two legal pages cannot drift apart in style. */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <Section width="prose">
      <h1 className="text-4xl font-bold tracking-tight text-navy-950">{doc.title}</h1>
      <p className="mt-3 text-sm text-navy-500">
        Last updated{" "}
        <time dateTime={doc.updated}>
          {new Date(doc.updated).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </p>
      <p className="mt-6 text-lg leading-relaxed text-navy-700">{doc.intro}</p>

      <div className="mt-10 space-y-5">
        {doc.body.map((block, index) => {
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
  );
}
