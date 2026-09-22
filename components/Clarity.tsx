"use client";

import Script from "next/script";

/**
 * Microsoft Clarity: session recordings and heatmaps.
 *
 * Loaded after hydration so it never competes with the page for the main
 * thread. The project id is public — it appears in the page source of every
 * site running Clarity — so it lives in a NEXT_PUBLIC variable like the GA4
 * measurement id.
 *
 * Recordings are masked at the form (see QuoteForm): a session replay of
 * somebody typing their name, phone, email and VIN is a copy of the lead
 * sitting in a third-party tool, which is not something to collect by accident.
 */
export function Clarity({ projectId }: { projectId: string }) {
  return (
    <Script id="clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${projectId}");`}
    </Script>
  );
}
