import { Logo } from "@/components/Logo";

/**
 * The seal and the name, locked up together.
 *
 * Logo is only the mark. The name beside it used to be copy-pasted wherever a
 * header was built, which is exactly how the application flow ended up
 * shipping a bare 32px seal and no name at all. One component, so a new header
 * cannot get the lockup half right.
 *
 * Sized in fixed square utilities rather than `h-8 w-auto`: the SVG carries a
 * viewBox and no intrinsic width, so its automatic width depends on the
 * browser rather than on us.
 */
export function Wordmark({ size = "default" }: { size?: "default" | "compact" }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo className={`${size === "compact" ? "size-8" : "size-9"} shrink-0`} />
      <span
        className={`font-bold tracking-tight whitespace-nowrap text-navy-900 ${
          size === "compact" ? "text-base" : "text-base sm:text-lg"
        }`}
      >
        The Title Bond <span className="text-navy-500">Agency</span>
      </span>
    </span>
  );
}
