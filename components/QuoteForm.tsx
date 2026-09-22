"use client";

import { useState } from "react";
import { APPLY_CLICK, track } from "@/lib/analytics";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "unavailable" | "invalid";

const FIELDS = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "vehicle", label: "Vehicle year, make and model", type: "text", autoComplete: "off" },
  { name: "vin", label: "VIN or serial number", type: "text", autoComplete: "off" },
] as const;

export function QuoteForm({ stateName }: { stateName: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, state: stateName }),
    }).catch(() => null);

    if (response?.ok) {
      // The conversion, reported with the same event name the rest of the site
      // uses so paid and organic land in one report.
      track(APPLY_CLICK, { link_location: "lp_form", state: stateName });
      setStatus("sent");
      return;
    }
    setStatus(response?.status === 400 ? "invalid" : "unavailable");
  }

  if (status === "sent") {
    return (
      <div className="rounded-card bg-white p-7 text-navy-900 shadow-lg" role="status">
        <h2 className="text-xl font-bold">Request received</h2>
        <p className="mt-3 leading-relaxed text-navy-600">
          A bond expert will call you about your {stateName} bonded title. Most
          bonds are issued the same day.
        </p>
        <a
          href={site.phoneHref}
          data-track-location="lp_confirmation"
          className="mt-6 inline-flex items-center rounded-full bg-navy-900 px-6 py-3 font-semibold text-white"
        >
          Or call {site.phone} now
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      // Session recording must never capture what someone types here.
      data-clarity-mask="true"
      className="rounded-card bg-white p-6 text-navy-900 shadow-lg sm:p-7"
      noValidate={false}
    >
      <h2 className="text-xl font-bold">Get your {stateName} quote</h2>
      <p className="mt-1.5 text-sm text-navy-600">
        Takes about a minute. No credit check under $30,000.
      </p>

      <div className="mt-5 space-y-3.5">
        {FIELDS.map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-medium text-navy-700">{field.label}</span>
            <input
              required
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              className="mt-1.5 w-full rounded-lg border border-navy-200 px-3.5 py-2.5 text-base outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-200"
            />
          </label>
        ))}
        {/* Honeypot: off-screen rather than hidden, so bots that skip
            display:none fields still fill it. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full rounded-full bg-amber-accent px-6 py-3.5 font-semibold text-navy-950 shadow-sm transition-colors hover:bg-amber-accent-dark disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Get my quote"}
      </button>

      {status === "invalid" && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          Please check your phone number and email, then try again.
        </p>
      )}
      {status === "unavailable" && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          We could not submit that just now. Please call{" "}
          <a href={site.phoneHref} className="font-semibold underline">
            {site.phone}
          </a>{" "}
          and we will take your details over the phone.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-navy-500">
        We use your details only to prepare your bond quote. See our{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2 hover:text-navy-700"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
