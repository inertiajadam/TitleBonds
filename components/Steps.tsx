import { Icon, type IconName } from "@/components/Icon";

const steps: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "file",
    title: "Tell us about your vehicle",
    body: "Your name and address, plus the year, make, model and VIN or serial number.",
  },
  {
    icon: "map",
    title: "Get your bond amount",
    body: "Most states set the bond at 1.5x or 2x the vehicle's value, determined by your DMV or a guide like NADA or Kelley Blue Book.",
  },
  {
    icon: "key",
    title: "Pay and file",
    body: "Bonds are typically issued the same day. Sign the original documents and file them with your DMV.",
  },
];

/**
 * Numbered as a sequence rather than three equal cards — the previous version
 * repeated the trust row's layout exactly, so the page had the same rhythm
 * three sections running.
 */
export function Steps() {
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      {/* Connective rule, drawn behind the markers on wide screens only. */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 left-8 hidden h-px bg-navy-200 md:block"
      />
      {steps.map((step, index) => (
        <li key={step.title} className="relative">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-accent text-navy-950 ring-8 ring-white">
              <Icon name={step.icon} className="size-[22px]" />
            </span>
            <span className="text-sm font-bold tracking-[0.18em] text-navy-400 uppercase">
              Step {index + 1}
            </span>
          </div>
          <h3 className="mt-5 text-xl font-bold text-navy-950">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-navy-600">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
