import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { terms } from "@/content/legal";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbNode, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: terms.title,
  description: terms.intro,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  const path = "/terms";
  return (
    <>
      <LegalDocument doc={terms} />
      <JsonLd
        data={graph({
          path,
          name: terms.title,
          description: terms.intro,
          dateModified: terms.updated,
          nodes: [
            breadcrumbNode(
              [
                { name: "Home", path: "" },
                { name: terms.title, path },
              ],
              path,
            ),
          ],
        })}
      />
    </>
  );
}
