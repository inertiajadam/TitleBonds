const widths = {
  default: "max-w-6xl",
  prose: "max-w-3xl",
} as const;

export function Section({
  children,
  width = "default",
  className = "",
}: {
  children: React.ReactNode;
  /** "prose" narrows the column for long-form reading. */
  width?: keyof typeof widths;
  className?: string;
}) {
  return (
    <section
      className={`mx-auto ${widths[width]} px-4 py-16 sm:py-20 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-navy-500 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-navy-600">{description}</p>
      )}
    </div>
  );
}
