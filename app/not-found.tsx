import Link from "next/link";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <Section className="text-center">
      <p className="text-sm font-semibold tracking-wide text-navy-500 uppercase">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-950">
        We couldn&apos;t find that page
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-navy-600">
        The page you were looking for may have moved. Try choosing your state, or
        give us a call and we will point you in the right direction.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/choose-your-state"
          className="rounded-full bg-navy-800 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-navy-900"
        >
          Choose your state
        </Link>
        <Link
          href="/"
          className="rounded-full px-7 py-3.5 font-semibold text-navy-800 ring-1 ring-navy-200 transition-colors hover:bg-navy-50"
        >
          Back home
        </Link>
      </div>
    </Section>
  );
}
