import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared card for every page's opengraph-image. Rendered at build time, so
 * there is no runtime image service and nothing to license.
 */
export function renderOgImage({
  eyebrow,
  title,
  facts,
}: {
  eyebrow: string;
  title: string;
  facts?: string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d1e3c",
          padding: 72,
          fontFamily: "sans-serif",
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
    ),
    OG_SIZE,
  );
}
