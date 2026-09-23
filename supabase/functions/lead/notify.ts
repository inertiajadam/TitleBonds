/**
 * The email that tells somebody a lead came in.
 *
 * Every value in here was typed by a stranger into a public form, so all of it
 * is escaped before it reaches the HTML body, and anything used in the subject
 * has newlines stripped. A lead is not a trusted document.
 *
 * Sending is best effort by design. The caller stores the lead first and
 * ignores the result: an outage at the email provider must not turn into a 503
 * on the site, because a stored lead with no email is recoverable and a lead
 * that was never accepted is not.
 */

export type Notifiable = {
  name: string;
  phone: string;
  email: string;
  state: string;
  vehicle: string;
  vin: string;
  receivedAt: string;
};

const ADMIN_URL = "https://titlebonds.us/admin";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Subjects are a header: a newline in one is a header injection. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export function notificationIsConfigured(): boolean {
  return Boolean(
    Deno.env.get("RESEND_API_KEY") &&
      Deno.env.get("LEAD_NOTIFY_TO") &&
      Deno.env.get("LEAD_NOTIFY_FROM"),
  );
}

function formatReceived(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  });
}

function textBody(lead: Notifiable): string {
  return [
    `${lead.name} — ${lead.state}`,
    "",
    `Phone:   ${lead.phone}`,
    `Email:   ${lead.email}`,
    `Vehicle: ${lead.vehicle}`,
    `VIN:     ${lead.vin}`,
    "",
    `Received ${formatReceived(lead.receivedAt)} CT`,
    ADMIN_URL,
  ].join("\n");
}

function htmlBody(lead: Notifiable): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#5a6b85;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:6px 0;color:#071227;font-size:15px">${value}</td>
    </tr>`;

  // tel: and mailto: are built from the escaped values too, so a quote in a
  // field cannot break out of the href.
  const telHref = escape(lead.phone.replace(/[^\d+]/g, ""));

  return `<!doctype html>
<html><body style="margin:0;background:#eef4fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:24px 16px">
    <div style="background:#ffffff;border:1px solid #aec8e8;border-radius:12px;padding:24px">
      <p style="margin:0 0 4px;color:#1f4685;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">New title bond lead</p>
      <h1 style="margin:0 0 2px;color:#071227;font-size:22px">${escape(lead.name)}</h1>
      <p style="margin:0 0 20px;color:#5a6b85;font-size:14px">${escape(lead.state)} &middot; ${escape(formatReceived(lead.receivedAt))} CT</p>

      <p style="margin:0 0 20px">
        <a href="tel:${telHref}" style="display:inline-block;background:#0d1e3c;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:12px 20px;border-radius:8px">Call ${escape(lead.phone)}</a>
      </p>

      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
        ${row("Email", `<a href="mailto:${escape(lead.email)}" style="color:#1f4685">${escape(lead.email)}</a>`)}
        ${row("Vehicle", escape(lead.vehicle))}
        ${row("VIN", `<span style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px">${escape(lead.vin)}</span>`)}
      </table>

      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #d6e4f4">
        <a href="${ADMIN_URL}" style="color:#1f4685;font-size:14px">Open in admin &rarr;</a>
      </p>
    </div>
  </div>
</body></html>`;
}

/** Resolves either way. The boolean is for logging, not for control flow. */
export async function sendLeadNotification(lead: Notifiable): Promise<boolean> {
  if (!notificationIsConfigured()) return false;

  const to = Deno.env
    .get("LEAD_NOTIFY_TO")!
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (to.length === 0) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: Deno.env.get("LEAD_NOTIFY_FROM"),
        to,
        // Replying to the alert reaches the customer, not the agency's own inbox.
        reply_to: lead.email,
        subject: `New title bond lead — ${oneLine(lead.name)} (${oneLine(lead.state)})`,
        text: textBody(lead),
        html: htmlBody(lead),
      }),
    });

    if (!response.ok) {
      console.error("lead notification rejected", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("lead notification failed", (error as Error).name);
    return false;
  }
}
