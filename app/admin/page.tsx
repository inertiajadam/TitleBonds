import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/admin-auth";
import { listLeads, leadsStoreIsConfigured, type StoredLead } from "@/lib/leads-store";
import { logout } from "./actions";
import { StatusSelect } from "@/components/admin/StatusSelect";

// Never cached and never prerendered: it reads a session cookie and live rows.
export const dynamic = "force-dynamic";

function formatWhen(lead: StoredLead): { relative: string; exact: string } {
  const when = new Date(lead.received_at ?? lead.created_at);
  const minutes = Math.floor((Date.now() - when.getTime()) / 60000);

  const relative =
    minutes < 1 ? "just now"
    : minutes < 60 ? `${minutes}m ago`
    : minutes < 60 * 24 ? `${Math.floor(minutes / 60)}h ago`
    : `${Math.floor(minutes / (60 * 24))}d ago`;

  return {
    relative,
    exact: when.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Chicago",
    }),
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-navy-500">{label}</dt>
      <dd className="mt-0.5 text-navy-900">{children}</dd>
    </div>
  );
}

export default async function AdminPage() {
  if (!(await hasValidSession())) redirect("/admin/login");

  if (!leadsStoreIsConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-bold text-navy-950">Leads</h1>
        <p className="mt-3 text-navy-700">
          The lead store is not connected on this deployment. Set{" "}
          <code className="rounded bg-navy-100 px-1.5 py-0.5 text-sm">SUPABASE_URL</code> and{" "}
          <code className="rounded bg-navy-100 px-1.5 py-0.5 text-sm">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
          , then reload.
        </p>
      </main>
    );
  }

  const leads = await listLeads();
  const fresh = leads.filter((lead) => lead.status === "new").length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">Leads</h1>
          <p className="mt-1 text-sm text-navy-600">
            {leads.length} total
            {fresh > 0 && <span className="font-semibold text-navy-900"> · {fresh} new</span>}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-navy-300 px-3 py-1.5 text-sm font-medium text-navy-800 transition hover:bg-navy-100"
          >
            Sign out
          </button>
        </form>
      </header>

      {leads.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-navy-300 bg-white px-6 py-12 text-center text-navy-600">
          No quote requests yet. They appear here the moment the form is submitted.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((lead) => {
            const when = formatWhen(lead);
            return (
              <li
                key={lead.id}
                className="rounded-xl border border-navy-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-navy-950">{lead.name}</h2>
                    <p className="text-sm text-navy-500" title={when.exact}>
                      {when.relative} · {lead.state}
                    </p>
                  </div>
                  <StatusSelect id={lead.id} status={lead.status} />
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Phone">
                    {/* The whole point of this page is getting someone called back. */}
                    <a
                      href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                      className="font-semibold text-navy-700 underline underline-offset-2"
                    >
                      {lead.phone}
                    </a>
                  </Field>
                  <Field label="Email">
                    <a
                      href={`mailto:${lead.email}`}
                      className="break-all text-navy-700 underline underline-offset-2"
                    >
                      {lead.email}
                    </a>
                  </Field>
                  <Field label="Vehicle">{lead.vehicle}</Field>
                  <Field label="VIN">
                    <span className="font-mono text-xs break-all">{lead.vin}</span>
                  </Field>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
