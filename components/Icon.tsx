/**
 * One icon system, consistent by construction.
 *
 * Every glyph is a 24x24 stroked path sharing the same grid, stroke width and
 * cap/join style, so they read as a set. The earlier icons were hand-drawn
 * filled paths in three different visual languages, which is what made the
 * trust row look assembled rather than designed.
 */
const paths = {
  shield:
    "M12 3 4.5 6v5.2c0 4.4 3.2 8.5 7.5 9.8 4.3-1.3 7.5-5.4 7.5-9.8V6L12 3Z M9 12l2 2 4-4",
  tag: "M3.5 12.4V5.5a2 2 0 0 1 2-2h6.9a2 2 0 0 1 1.4.6l6.1 6.1a2 2 0 0 1 0 2.8l-6.9 6.9a2 2 0 0 1-2.8 0l-6.1-6.1a2 2 0 0 1-.6-1.4Z M8 8h.01",
  bolt: "M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z",
  key: "M15.5 3.5a5 5 0 1 0-4.2 8.6L10 13.4 8.6 12l-1.4 1.4L8.6 15l-1.1 1.1L6 14.6 4.6 16l1.5 1.5-1.6 1.6v1.4h1.4l7-7a5 5 0 0 0 2.6-10Z M16.5 7.5h.01",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z M14 3v5h5 M9 13h6 M9 17h4",
  phone:
    "M20 16.9v2.6a1.5 1.5 0 0 1-1.7 1.5 17.5 17.5 0 0 1-15.3-15.3A1.5 1.5 0 0 1 4.5 4h2.6a1.5 1.5 0 0 1 1.5 1.3c.1 1 .3 1.9.6 2.8a1.5 1.5 0 0 1-.3 1.6L7.8 10.8a14 14 0 0 0 5.4 5.4l1.1-1.1a1.5 1.5 0 0 1 1.6-.3c.9.3 1.8.5 2.8.6A1.5 1.5 0 0 1 20 16.9Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3.2 1.9",
  check: "M20 6 9 17l-5-5",
  map: "M9 20 3 17.5v-13L9 7m0 13 6-2.5M9 20V7m6 10.5 6 2.5v-13L15 4m0 13.5V4M9 7l6-3",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name].split(" M").map((segment, index) => (
        <path key={index} d={index === 0 ? segment : `M${segment}`} />
      ))}
    </svg>
  );
}
