import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { privacyPolicy } from "@/content/legal";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbNode, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.intro,
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  const path = "/privacy-policy";
  return (
    <>
      <LegalDocument doc={privacyPolicy} />
      <JsonLd
        data={graph({
          path,
          name: privacyPolicy.title,
          description: privacyPolicy.intro,
          dateModified: privacyPolicy.updated,
          nodes: [
            breadcrumbNode(
              [
                { name: "Home", path: "" },
                { name: privacyPolicy.title, path },
              ],
              path,
            ),
          ],
        })}
      />
    </>
  );
}
