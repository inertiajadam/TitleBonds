import Image from "next/image";
import { StateSelect } from "@/components/StateSelect";
import heroImage from "@/public/img/hero-trailer.jpg";

/**
 * The homepage previously opened on a flat navy rectangle. A photograph of the
 * kind of property this business actually bonds — a vintage trailer — does the
 * emotional work that no amount of type can, and the image's open sky gives the
 * headline somewhere to sit without a heavy scrim fighting it.
 */
export function Hero({ states }: { states: Array<{ slug: string; name: string }> }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      {/* Below lg the hero is tall and narrow, and covering it with a
          landscape photo blows up a thin slice of the middle — the trailer
          stopped reading as a trailer at all. So the photo takes a band
          across the top at close to its own proportions and the copy sits on
          navy beneath it, matching the state pages. From lg it goes back to a
          full backdrop with the headline over the open sky, which is what the
          photo was chosen for. */}
      <div className="absolute inset-x-0 top-0 h-56 sm:h-72 lg:inset-0 lg:h-auto">
        <Image
          src={heroImage}
          alt=""
          priority
          placeholder="blur"
          sizes="100vw"
          className="size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/15 via-navy-950/20 to-navy-950 lg:hidden" />
      </div>

      {/* Two scrims: a horizontal one so the headline stays legible over the
          bright sky, and a vertical one to seat the section on the page. */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/25 lg:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40 lg:block" />

      <div className="relative mx-auto max-w-6xl px-4 pt-60 pb-20 sm:pt-80 sm:pb-24 lg:py-40">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.18em] text-amber-accent uppercase">
            <span className="h-px w-8 bg-amber-accent" />
            The Title Bond Agency
          </p>

          <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold text-white sm:text-6xl lg:text-7xl">
            Lost the title?
            <span className="block text-navy-200">We can fix that.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-navy-100 sm:text-xl">
            A certificate of title bond replaces a lost, stolen, damaged or
            defective title for your car, truck, RV, motorcycle, mobile home,
            boat, trailer or aircraft.
          </p>

          <div className="mt-10 max-w-xl">
            <StateSelect states={states} label="Select your state to learn more" />
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-x-5 gap-y-6 border-t border-white/15 pt-7">
            {[
              ["From $100", "or 1.5% of the bond"],
              ["No credit check", "on bonds under $30k"],
              ["Same day", "most bonds issued"],
            ].map(([value, label]) => (
              <div key={value}>
                <dt className="text-sm font-bold text-balance text-white sm:text-lg">
                  {value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-balance text-navy-300 sm:text-sm">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
