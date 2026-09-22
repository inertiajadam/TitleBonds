"use client";

import { useEffect } from "react";
import { PHONE_CLICK, track } from "@/lib/analytics";

/**
 * One delegated listener for the whole site.
 *
 * The alternative is a client boundary on every button and phone number, which
 * would ship React to pages that are otherwise pure HTML. This keeps the links
 * themselves server-rendered: they carry data attributes, and this reads them.
 *
 * Any tel: link is reported whether or not it was marked up, so a phone number
 * added later is measured without anyone remembering to annotate it.
 */
export function ConversionEvents() {
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;

      const name =
        link.dataset.track ??
        (link.getAttribute("href")?.startsWith("tel:") ? PHONE_CLICK : undefined);
      if (!name) return;

      track(name, {
        link_location: link.dataset.trackLocation,
        state: link.dataset.trackState,
      });
    }

    // pointerdown rather than click: it fires before the browser starts
    // unloading the page for an outbound link, which gives the request a
    // better chance of leaving even where beacon transport is unavailable.
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return null;
}
