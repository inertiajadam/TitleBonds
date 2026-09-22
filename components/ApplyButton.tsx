import Link from "next/link";
import { applyUrl } from "@/lib/site";
import { APPLY_CLICK, trackAttrs, type LinkLocation } from "@/lib/analytics";

type Props = {
  stateName?: string;
  children?: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  /** Which CTA this is, so a weak button can be told from a weak page. */
  location: LinkLocation;
};

const variants = {
  primary:
    "bg-amber-accent text-navy-950 hover:bg-amber-accent-dark focus-visible:outline-amber-accent",
  secondary:
    "bg-white text-navy-800 ring-1 ring-navy-200 hover:bg-navy-50 focus-visible:outline-navy-600",
} as const;

// Sizes live here rather than being passed through className: Tailwind resolves
// conflicting utilities by stylesheet order, not by the order they appear in the
// class attribute, so an override passed in would be a coin flip.
const sizes = {
  default: "px-7 py-3.5 text-base",
  compact: "px-5 py-2.5 text-sm",
} as const;

export function ApplyButton({
  stateName,
  children,
  variant = "primary",
  size = "default",
  className = "",
  location,
}: Props) {
  return (
    <Link
      href={applyUrl(stateName)}
      {...trackAttrs(APPLY_CLICK, location, stateName)}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children ?? (stateName ? `Get Your ${stateName} Bonded Title` : "Apply Now")}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}
