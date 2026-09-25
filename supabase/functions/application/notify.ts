/**
 * The email that says an application came in.
 *
 * Louder than the lead alert on purpose: this person has given their legal
 * name, home address and VIN and expects a bond, so the subject says APPLICATION
 * and the body leads with what has to happen next, which until the payment
 * step exists is a phone call to take payment.
 *
 * Same escaping rules as the lead notifier, for the same reason: every value
 * was typed by a stranger into a public form.
 */

export type Notifiable = {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  state: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  vehicleValue: number | string;
  estimatedBondAmount?: number | string;
  estimatedPremium?: number | string;
  receivedAt: string;
};

const ADMIN_URL = "https://titlebonds.us/admin";

const ESCAPES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const escape = (v: string) => String(v).replace(/[&<>"']/g, (c) => ESCAPES[c]);
const oneLine = (v: string) => String(v).replace(/[\r\n]+/g, " ").trim();

const money = (v: number | string | undefined) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : null;
};

export function notificationIsConfigured(): boolean {
  return Boolean(
    Deno.env.get("RESEND_API_KEY") &&
      Deno.env.get("LEAD_NOTIFY_TO") &&
      Deno.env.get("LEAD_NOTIFY_FROM"),
  );
}

const received = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago",
  });

function lines(a: Notifiable): string[] {
  const premium = money(a.estimatedPremium);
  const bond = money(a.estimatedBondAmount);
  return [
    `${a.applicantName} — ${a.state}`,
    "",
    `Phone:   ${a.applicantPhone}`,
    `Email:   ${a.applicantEmail}`,
    `Address: ${[a.addressLine1, a.addressLine2, `${a.city}, ${a.region} ${a.postalCode}`]
      .filter(Boolean).join(", ")}`,
    "",
    `Vehicle: ${a.vehicleYear} ${a.vehicleMake} ${a.vehicleModel}`,
    `VIN:     ${a.vin}`,
    `Value:   ${money(a.vehicleValue) ?? a.vehicleValue}`,
    "",
    bond && premium
      ? `Quoted:  ${bond} bond, ${premium} premium (estimate)`
      : "Quoted:  no estimate shown; this state publishes no formula",
    "",
    "PAYMENT NOT TAKEN. Call to confirm the amount and collect payment.",
    "",
    `Received ${received(a.receivedAt)} CT`,
    ADMIN_URL,
  ];
}

function htmlBody(a: Notifiable): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#5a6b85;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:6px 0;color:#071227;font-size:15px">${value}</td>
    </tr>`;

  const tel = escape(String(a.applicantPhone).replace(/[^\d+]/g, ""));
  const bond = money(a.estimatedBondAmount);
  const premium = money(a.estimatedPremium);
  const address = [a.addressLine1, a.addressLine2, `${a.city}, ${a.region} ${a.postalCode}`]
    .filter(Boolean).map((p) => escape(String(p))).join("<br>");

  return `<!doctype html>
<html><body style="margin:0;background:#eef4fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#ffffff;border:1px solid #aec8e8;border-radius:12px;padding:24px">
      <p style="margin:0 0 4px;color:#1f4685;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">New bond application</p>
      <h1 style="margin:0 0 2px;color:#071227;font-size:22px">${escape(a.applicantName)}</h1>
      <p style="margin:0 0 20px;color:#5a6b85;font-size:14px">${escape(a.state)} &middot; ${escape(received(a.receivedAt))} CT</p>

      <div style="background:#fff8e6;border:1px solid #f2a11d;border-radius:8px;padding:12px 14px;margin:0 0 20px">
        <p style="margin:0;color:#071227;font-size:14px;font-weight:600">Payment not taken</p>
        <p style="margin:4px 0 0;color:#5a6b85;font-size:13px">Call to confirm the bond amount and collect payment.</p>
      </div>

      <p style="margin:0 0 20px">
        <a href="tel:${tel}" style="display:inline-block;background:#0d1e3c;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:12px 20px;border-radius:8px">Call ${escape(String(a.applicantPhone))}</a>
      </p>

      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
        ${row("Email", `<a href="mailto:${escape(a.applicantEmail)}" style="color:#1f4685">${escape(a.applicantEmail)}</a>`)}
        ${row("Address", address)}
        ${row("Vehicle", escape(`${a.vehicleYear} ${a.vehicleMake} ${a.vehicleModel}`))}
        ${row("VIN", `<span style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px">${escape(a.vin)}</span>`)}
        ${row("Stated value", escape(money(a.vehicleValue) ?? String(a.vehicleValue)))}
        ${row("Quoted", bond && premium
          ? `${escape(bond)} bond, <strong>${escape(premium)}</strong> premium <span style="color:#5a6b85">(estimate)</span>`
          : `<span style="color:#5a6b85">No estimate shown; this state publishes no formula.</span>`)}
      </table>

      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #d6e4f4">
        <a href="${ADMIN_URL}" style="color:#1f4685;font-size:14px">Open in admin &rarr;</a>
      </p>
    </div>
  </div>
</body></html>`;
}

/** Resolves either way. The boolean is for logging, not for control flow. */
export async function sendApplicationNotification(a: Notifiable): Promise<boolean> {
  if (!notificationIsConfigured()) return false;

  const to = Deno.env.get("LEAD_NOTIFY_TO")!.split(",").map((s) => s.trim()).filter(Boolean);
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
        reply_to: a.applicantEmail,
        subject: `APPLICATION — ${oneLine(a.applicantName)} (${oneLine(a.state)})`,
        text: lines(a).join("\n"),
        html: htmlBody(a),
      }),
    });
    if (!response.ok) {
      console.error("application notification rejected", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("application notification failed", (error as Error).name);
    return false;
  }
}
