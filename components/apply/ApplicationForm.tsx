"use client";

import { useMemo, useState } from "react";
import { computeEstimate, usd, type BondRule } from "@/lib/bond-math";
import { APPLY_CLICK, track } from "@/lib/analytics";
import { site } from "@/lib/site";

/**
 * The application flow.
 *
 * Three steps, and the application completes without taking payment. The
 * agency's gateway is not known yet, so rather than leave the flow dead-ended
 * the customer is told plainly that they will get a call to confirm the amount
 * and pay. That is worth more than a fourth step that does not work: it is
 * already better than sending them to another company's website.
 *
 * The applicant fields are the ones every surety needs for every bond, so they
 * are safe to build before the platform's spec lands. Anything that spec adds
 * rides in `details`, which the API and the table both pass through untouched.
 *
 * A failed submit says so and offers the phone number. It never says thank you
 * for something it did not manage to send.
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

const APPLICANT_FIELDS = [
  { name: "applicantName", label: "Full legal name", span: "col-span-6", autoComplete: "name" },
  { name: "applicantPhone", label: "Phone", span: "col-span-6 sm:col-span-3", autoComplete: "tel", type: "tel" },
  { name: "applicantEmail", label: "Email", span: "col-span-6 sm:col-span-3", autoComplete: "email", type: "email" },
  { name: "addressLine1", label: "Street address", span: "col-span-6", autoComplete: "address-line1" },
  { name: "addressLine2", label: "Apartment or unit (optional)", span: "col-span-6", autoComplete: "address-line2", optional: true },
  { name: "city", label: "City", span: "col-span-6 sm:col-span-3", autoComplete: "address-level2" },
  { name: "region", label: "State", span: "col-span-3 sm:col-span-1", autoComplete: "address-level1" },
  { name: "postalCode", label: "ZIP", span: "col-span-3 sm:col-span-2", autoComplete: "postal-code" },
] as const;

type ApplicantField = (typeof APPLICANT_FIELDS)[number]["name"];

const STEPS = ["Vehicle", "Value", "Your details"] as const;

type Status = "idle" | "sending" | "sent" | "invalid" | "unavailable";

export function ApplicationForm({ stateName, rule, noRuleReason }: Props) {
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState({ year: "", make: "", model: "", vin: "" });
  const [value, setValue] = useState("");
  const [applicant, setApplicant] = useState<Record<ApplicantField, string>>({
    applicantName: "", applicantPhone: "", applicantEmail: "",
    addressLine1: "", addressLine2: "", city: "", region: "", postalCode: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  // Recomputed as they type, which is the whole reason this is a client
  // component and the arithmetic lives in a module without node:fs in it.
  const estimate = useMemo(
    () => computeEstimate(rule, Number(value.replace(/[^0-9.]/g, "")), noRuleReason),
    [rule, value, noRuleReason],
  );

  const vehicleComplete =
    vehicle.year.trim() !== "" && vehicle.make.trim() !== "" &&
    vehicle.model.trim() !== "" && vehicle.vin.trim() !== "";

  const applicantComplete = APPLICANT_FIELDS.every(
    (field) => "optional" in field || applicant[field.name].trim() !== "",
  );

  async function submit() {
    setStatus("sending");
    const response = await fetch("/api/application", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...applicant,
        state: stateName,
        vehicleYear: vehicle.year,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vin: vehicle.vin,
        vehicleValue: Number(value.replace(/[^0-9.]/g, "")),
        // What was on screen when they agreed, so a later dispute has a record.
        ...(estimate.kind === "estimate"
          ? { estimatedBondAmount: estimate.bondAmount, estimatedPremium: estimate.premium }
          : {}),
      }),
    }).catch(() => null);

    if (response?.ok) {
      track(APPLY_CLICK, { link_location: "apply_form", state: stateName });
      setStatus("sent");
      return;
    }
    setStatus(response?.status === 400 ? "invalid" : "unavailable");
  }

  if (status === "sent") {
    return (
      <div className="rounded-card bg-white p-7 shadow-sm sm:p-8" role="status">
        <h2 className="text-xl font-bold text-navy-950">Application received</h2>
        <p className="mt-3 leading-relaxed text-navy-700">
          We are confirming your {stateName} bond amount now. Someone will call
          you on the number you gave us to take payment, usually the same day.
          Nothing has been charged.
        </p>
        <a
          href={site.phoneHref}
          data-track="phone_click"
          data-track-location="apply_confirmation"
          className="mt-6 inline-flex items-center rounded-full bg-navy-900 px-6 py-3 font-semibold text-white"
        >
          Or call {site.phone} now
        </a>
      </div>
    );
  }

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

      {step === 2 && (
        <section className="mt-5">
          <h2 className="text-xl font-bold text-navy-950">Your details</h2>
          <p className="mt-1 text-sm text-navy-600">
            As they should appear on the bond, which is the legal name and the
            address your title will be mailed to.
          </p>

          <div className="mt-5 grid grid-cols-6 gap-3">
            {APPLICANT_FIELDS.map((field) => (
              <label key={field.name} className={field.span}>
                <span className="text-sm font-medium text-navy-700">{field.label}</span>
                <input
                  value={applicant[field.name]}
                  type={"type" in field ? field.type : "text"}
                  autoComplete={field.autoComplete}
                  onChange={(e) =>
                    setApplicant({ ...applicant, [field.name]: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-base outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-200"
                />
              </label>
            ))}
            {/* Honeypot, same trick as the quote form. */}
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off"
              aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0"
            />
          </div>

          <div className="mt-5 rounded-xl border border-navy-200 bg-navy-50 p-4">
            <p className="text-sm leading-relaxed text-navy-700">
              <strong className="font-semibold text-navy-900">
                You are not charged now.
              </strong>{" "}
              We confirm your bond amount
              {estimate.kind === "estimate" ? ` (estimated ${usd(estimate.premium)})` : ""}{" "}
              and call you to take payment, usually the same day.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={status === "sending"}
              className="rounded-full px-5 py-3.5 font-semibold text-navy-800 ring-1 ring-navy-200 hover:bg-navy-50 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!applicantComplete || status === "sending"}
              onClick={submit}
              className="flex-1 rounded-full bg-amber-accent px-6 py-3.5 font-semibold text-navy-950 transition-colors hover:bg-amber-accent-dark disabled:opacity-40"
            >
              {status === "sending" ? "Submitting…" : "Submit application"}
            </button>
          </div>

          {status === "invalid" && (
            <p className="mt-3 text-sm text-red-700" role="alert">
              Please check your phone number and email, then try again.
            </p>
          )}
          {status === "unavailable" && (
            <p className="mt-3 text-sm text-red-700" role="alert">
              We could not submit that just now, and we would rather tell you
              than lose it. Please call{" "}
              <a href={site.phoneHref} className="font-semibold underline">
                {site.phone}
              </a>{" "}
              and we will take the application over the phone.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
