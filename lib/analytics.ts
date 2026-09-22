/**
 * Conversion events.
 *
 * This business has two outcomes and neither of them happens on this site: the
 * visitor either leaves for the partner's application form or picks up the
 * phone. Both are ordinary link clicks, so both are invisible to analytics
 * unless we say so explicitly — which is why the property recorded no
 * conversions at all for the twelve months before this was added.
 */

/** Event names. Mark these as key events in GA4; code cannot do that part. */
export const APPLY_CLICK = "apply_click";
export const PHONE_CLICK = "phone_click";

/** Where on the page the link was, so a weak CTA can be told from a weak page. */
export type LinkLocation =
  | "header"
  | "footer"
  | "hero"
  | "masthead"
  | "state_cta"
  | "post_cta"
  | "contact"
  | "faq_cta";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/**
 * Send an event if, and only if, analytics actually loaded. It is absent on
 * preview deployments, when the measurement ID is unset, and whenever a
 * blocker gets there first, so every call has to survive that.
 */
export function track(name: string, params: Record<string, string | undefined> = {}) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;

  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) clean[key] = value;
  }
  gtag("event", name, clean);
}

/** Attributes a link carries so the delegated listener knows what to report. */
export function trackAttrs(event: string, location: LinkLocation, stateName?: string) {
  return {
    "data-track": event,
    "data-track-location": location,
    ...(stateName ? { "data-track-state": stateName } : {}),
  };
}
