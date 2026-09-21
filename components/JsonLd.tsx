export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Build-time constant assembled from repo content; no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
