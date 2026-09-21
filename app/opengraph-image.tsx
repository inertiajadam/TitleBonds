import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "The Title Bond Agency — lost, stolen and damaged title bonds";

export default function Image() {
  return renderOgImage({
    eyebrow: "The Title Bond Agency",
    title: "Replace your lost, stolen or damaged title",
    facts: [
      "Rates from 1.5%",
      "No credit check under $30,000",
      "Most bonds issued same day",
    ],
    photo: "hero-trailer",
  });
}
