"use client";

import { useMemo, useState } from "react";
import { computeEstimate, usd, type BondRule } from "@/lib/bond-math";

/**
 * The application flow.
 *
 * Two of the four steps are live. Applicant details wait on the field list
 * from the bond platform, and payment waits on knowing which gateway the
 * agency uses; both are rendered as explicit "not built yet" panels rather
 * than being hidden, so what is missing is obvious in review instead of
 * looking finished and silently doing nothing.
 *
 * Nothing here is submitted anywhere yet. That is deliberate: an application
 * that appears to send and does not is the failure mode the quote form's 503
 * was written to avoid, and the same rule applies here.
 */

type Props = {
  stateName: string;
  /** Null when the state publishes no formula; then `noRuleReason` explains. */
  rule: BondRule | null;
  noRuleReason: string;
};

const VEHICLE_FIELDS = [
  { name: "year", label: "Year", width: "sm", inputMode: "numeric" as const },
  { name: "make", label: "Make", width: "md" },
  { name: "model", label: "Model", width: "md" },
] as const;

const STEPS = ["Vehicle", "Value", "Your details", "Payment"] as const;

export function ApplicationForm({ stateName, rule, noRuleReason }: Props) {
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState({ year: "", make: "", model: "", vin: "" });
  const [value, setValue] = useState("");

  // Recomputed as they type, which is the whole reason this is a client
  // component and the arithmetic lives in a module without node:fs in it.
  const estimate = useMemo(
    () => computeEstimate(rule, Number(value.replace(/[^0-9.]/g, "")), noRuleReason),
    [rule, value, noRuleReason],
  );

  const vehicleComplete =
    vehicle.year.trim() !== "" && vehicle.make.trim() !== "" &&
    vehicle.model.trim() !== "" && vehicle.vin.trim() !== "";

  return (
    <div className="rounded-card bg-white p-6 shadow-sm sm:p-8" data-clarity-mask="true">
      <ol className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold tracking-wide uppercase">
        {STEPS.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={
              index === step ? "text-navy-900"
              : index < step ? "text-navy-400"
              : "text-navy-300"
            }
          >
            {index > 0 && <span className="mr-2 text-navy-200">/</span>}
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="mt-5">
          <h2 className="text-xl font-bold text-navy-950">About the vehicle</h2>
          <p className="mt-1 text-sm text-navy-600">
            As it appears on the paperwork you have.
          </p>

          <div className="mt-5 grid grid-cols-6 gap-3">
            {VEHICLE_FIELDS.map((field) => (
              <label
                key={field.name}
                className={field.width === "sm" ? "col-span-2" : "col-span-4 sm:col-span-2"}
              >
                <span className="text-sm font-medium text-navy-700">{field.label}</span>
                <input
                  value={vehicle[field.name]}
                  inputMode={"inputMode" in field ? field.inputMode : undefined}
                  onChange={(e) => setVehicle({ ...vehicle, [field.name]: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-base outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-200"
                />
              </label>
            ))}
            <label className="col-span-6">
              <span className="text-sm font-medium text-navy-700">
                VIN or serial number
              </span>
              <input
                value={vehicle.vin}
                autoComplete="off"
                onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-navy-200 px-3 py-2.5 font-mono text-base outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-200"
              />
              {/* Older trailers and homebuilts have short serials, so this is
                  never length-checked here. */}
              <span className="mt-1 block text-xs text-navy-500">
                Older trailers and boats often have a short serial rather than a
                17-character VIN. Enter whatever is on yours.
              </span>
            </label>
          </div>

          <button
            type="button"
            disabled={!vehicleComplete}
            onClick={() => setStep(1)}
            className="mt-6 w-full rounded-full bg-navy-900 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
          >
            Continue
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="mt-5">
          <h2 className="text-xl font-bold text-navy-950">What is the vehicle worth?</h2>
          <p className="mt-1 text-sm text-navy-600">
            Your best estimate is fine. {stateName} confirms the figure before
            the bond is issued.
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-navy-700">Vehicle value</span>
            <div className="mt-1.5 flex items-center rounded-lg border border-navy-200 px-3 focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-200">
              <span className="text-navy-500">$</span>
              <input
                value={value}
                inputMode="decimal"
                autoFocus
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-transparent py-2.5 pl-1.5 text-base outline-none"
              />
            </div>
          </label>

          <div className="mt-5 rounded-xl border border-navy-200 bg-navy-50 p-5">
            {estimate.kind === "estimate" ? (
              <>
                <dl className="space-y-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-navy-600">Estimated bond amount</dt>
                    <dd className="text-lg font-bold text-navy-950">
                      {usd(estimate.bondAmount)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-navy-600">Estimated premium</dt>
                    <dd className="text-2xl font-bold text-navy-950">
                      {usd(estimate.premium)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 border-t border-navy-200 pt-3 text-xs leading-relaxed text-navy-600">
                  {stateName} requires {estimate.basis.toLowerCase()}. Premium is
                  1.5% of the bond amount, $100 minimum. These are estimates:
                  your final amount is set once the vehicle&rsquo;s value is
                  confirmed, and you are only charged the exact figure once your
                  bond is approved.
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-navy-700">{estimate.reason}</p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full px-5 py-3.5 font-semibold text-navy-800 ring-1 ring-navy-200 hover:bg-navy-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-full bg-amber-accent px-6 py-3.5 font-semibold text-navy-950 transition-colors hover:bg-amber-accent-dark"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step >= 2 && (
        <section className="mt-5">
          <h2 className="text-xl font-bold text-navy-950">{STEPS[step]}</h2>
          <div className="mt-4 rounded-xl border border-dashed border-navy-300 bg-navy-50 p-5">
            <p className="text-sm leading-relaxed text-navy-700">
              {step === 2
                ? "Not built yet. The applicant fields are waiting on the bond platform's application spec, so that what we collect matches what it needs rather than being mapped twice."
                : "Not built yet. Payment is waiting on which gateway the agency uses. Card details will go straight from this page to the processor and never touch our servers."}
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-full px-5 py-3.5 font-semibold text-navy-800 ring-1 ring-navy-200 hover:bg-navy-50"
            >
              Back
            </button>
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-full bg-navy-900 px-6 py-3.5 font-semibold text-white hover:bg-navy-800"
              >
                Continue
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
