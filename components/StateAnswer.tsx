import type { TitleBondState } from "@/lib/states";

/**
 * A direct, self-contained answer to "what does a title bond cost in X and how
 * does it work", built from the same structured rates the page displays.
 *
 * Answer engines quote the first passage that answers the question outright, so
 * the page leads with one rather than making them assemble it from the FAQ.
 * Every clause is omitted when the underlying field is missing — a confident
 * sentence built on a gap is the failure mode worth avoiding here.
 */
export function stateAnswerText(state: TitleBondState): string {
  const { minPremium, rate, amountRequired, noCreditCheckUpTo } = state.rates;
  const sentences: string[] = [];

  if (minPremium && rate) {
    sentences.push(
      `A ${state.name} certificate of title bond costs ${minPremium} or ${rate.replace(/ \(.*\)$/, "")} of the bond amount, whichever is greater.`,
    );
  } else if (minPremium) {
    sentences.push(
      `${state.name} certificate of title bonds start at ${minPremium}.`,
    );
  }

  if (amountRequired) {
    const amount = amountRequired.charAt(0).toLowerCase() + amountRequired.slice(1);
    sentences.push(
      `The bond amount is ${amount}, determined by the ${state.agency}${state.statute ? ` under ${state.statute}` : ""}.`,
    );
  }

  if (noCreditCheckUpTo) {
    sentences.push(`No credit check is required for bonds under ${noCreditCheckUpTo}.`);
  }

  sentences.push(
    `Once the bond is filed, ${state.name} issues a bonded title that lets you register, insure and sell the vehicle.`,
  );

  return sentences.join(" ");
}

export function StateAnswer({ state }: { state: TitleBondState }) {
  return (
    <p className="mt-6 border-l-4 border-amber-accent pl-5 text-lg leading-relaxed text-white sm:text-xl">
      {stateAnswerText(state)}
    </p>
  );
}
