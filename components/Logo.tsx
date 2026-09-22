/**
 * The mark: a surety seal with the two lines of a title document inside it.
 *
 * Drawn as paths rather than set as SVG <text>, which is what the placeholder
 * did — live text in an icon renders with whatever font the machine happens to
 * have and can fail outright in favicon rasterisers and social scrapers.
 *
 * No background tile, so the same mark works on the white header and the navy
 * footer. The amber ring is what carries recognition at 16px, where the inner
 * lines merge; three lines were tried first and turned to noise at that size.
 *
 * Keep this in step with app/icon.svg, which is the same geometry standing
 * alone as the favicon.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path
        d="M16.00 6.40 Q18.95 4.99 20.80 7.69 Q24.06 7.94 24.31 11.20 Q27.01 13.05 25.60 16.00 Q27.01 18.95 24.31 20.80 Q24.06 24.06 20.80 24.31 Q18.95 27.01 16.00 25.60 Q13.05 27.01 11.20 24.31 Q7.94 24.06 7.69 20.80 Q4.99 18.95 6.40 16.00 Q4.99 13.05 7.69 11.20 Q7.94 7.94 11.20 7.69 Q13.05 4.99 16.00 6.40Z"
        fill="var(--color-amber-accent)"
      />
      <circle cx="16" cy="16" r="7.4" fill="var(--color-navy-900)" />
      <rect x="11.5" y="12.5" width="9" height="2.4" rx="1.2" fill="#fff" />
      <rect x="13" y="17.1" width="6" height="2.4" rx="1.2" fill="#fff" />
    </svg>
  );
}
