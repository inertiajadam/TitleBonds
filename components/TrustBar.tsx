const points = [
  {
    title: "100% Secure",
    body: "Our online title bond process is 100% secure. We are committed to your privacy.",
    icon: (
      <path d="M12 2 4 5.5v6c0 5 3.4 9.3 8 10.5 4.6-1.2 8-5.5 8-10.5v-6L12 2Zm-1 13-3.5-3.5 1.4-1.4L11 12.2l4.1-4.1 1.4 1.4L11 15Z" />
    ),
  },
  {
    title: "Unbeatable Prices",
    body: "Our team monitors rates and competitive prices on a regular basis to ensure you get the best deal possible.",
    icon: (
      <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm1 17.2v1.3h-2v-1.3c-1.8-.3-3.2-1.5-3.3-3.4h2c.1.9.8 1.6 2.3 1.6 1.6 0 2-.8 2-1.3 0-.7-.4-1.4-2.4-1.9-2.3-.5-3.8-1.5-3.8-3.4 0-1.6 1.3-2.7 3.2-3V5.5h2v1.3c1.9.4 2.9 1.8 3 3.3h-2c-.1-1-.6-1.6-2-1.6-1.3 0-2.1.6-2.1 1.4 0 .7.5 1.2 2.4 1.7 1.9.5 3.8 1.3 3.8 3.6 0 1.7-1.3 2.7-3.1 3Z" />
    ),
  },
  {
    title: "Fast & Simple",
    body: "Our online title bond application is as easy as 1-2-3. In many cases, you can get your title bond issued today.",
    icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  },
];

export function TrustBar() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {points.map((point) => (
        <div
          key={point.title}
          className="rounded-card border border-navy-100 bg-white p-7 shadow-sm"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
              {point.icon}
            </svg>
          </span>
          <h3 className="mt-5 text-lg font-bold text-navy-950">{point.title}</h3>
          <p className="mt-2 leading-relaxed text-navy-600">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
