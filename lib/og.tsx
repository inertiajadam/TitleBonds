import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPhoto, type PhotoKey } from "@/lib/photos";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The renderer has no filesystem or network access, so a backdrop has to be
 * handed to it as bytes. These are the pre-cut 1200x630 crops, read once per
 * build and inlined.
 */
function backdrop(key: PhotoKey): string {
  const file = path.join(process.cwd(), "public", getPhoto(key).og);
  return `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
}

const FILL = { position: "absolute", top: 0, left: 0, width: 1200, height: 630 } as const;

/**
 * Shared card for every page's opengraph-image. Rendered at build time, so
 * there is no runtime image service and nothing to license.
 */
export function renderOgImage({
  eyebrow,
  title,
  facts,
  photo,
}: {
  eyebrow: string;
  title: string;
  facts?: string[];
  /** Photograph to sit behind the card; omit for flat navy. */
  photo?: PhotoKey;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0d1e3c",
          fontFamily: "sans-serif",
        }}
      >
        {photo && (
          <img src={backdrop(photo)} width={1200} height={630} style={FILL} />
        )}
        {/* Same two-scrim treatment as the page mastheads: one across, to hold
            the headline, and one up, to seat the footer rule. */}
        <div
          style={{
            ...FILL,
            background:
              "linear-gradient(90deg, rgba(13,30,60,0.97) 0%, rgba(13,30,60,0.9) 50%, rgba(13,30,60,0.52) 100%)",
          }}
        />
        <div
          style={{
            ...FILL,
            background:
              "linear-gradient(0deg, rgba(13,30,60,0.95) 0%, rgba(13,30,60,0.3) 55%, rgba(13,30,60,0.6) 100%)",
          }}
        />

        <div
          style={{
            ...FILL,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 72,
          }}
        >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#f2a11d",
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 60 ? 62 : 76,
              lineHeight: 1.1,
              color: "#ffffff",
              fontWeight: 700,
              marginTop: 28,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {facts && facts.length > 0 && (
            <div style={{ display: "flex", gap: 20, marginBottom: 34, flexWrap: "wrap" }}>
              {facts.map((fact) => (
                <div
                  key={fact}
                  style={{
                    display: "flex",
                    fontSize: 25,
                    color: "#d6e4f4",
                    border: "1px solid #2b5da5",
                    borderRadius: 999,
                    padding: "12px 26px",
                  }}
                >
                  {fact}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #18376a",
              paddingTop: 30,
            }}
          >
            <div style={{ display: "flex", fontSize: 30, color: "#ffffff", fontWeight: 700 }}>
              titlebonds.us
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#7ba4d8" }}>
              (800) 737-4880
            </div>
          </div>
        </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
