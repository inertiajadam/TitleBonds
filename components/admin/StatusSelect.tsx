"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateStatus } from "@/app/admin/actions";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/lead-status";

const LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  issued: "Issued",
  lost: "Lost",
};

/** Colour carries the same information as the label, never on its own. */
const STYLES: Record<LeadStatus, string> = {
  new: "bg-amber-100 text-amber-900 border-amber-300",
  contacted: "bg-navy-100 text-navy-900 border-navy-300",
  quoted: "bg-navy-100 text-navy-900 border-navy-300",
  issued: "bg-green-100 text-green-900 border-green-300",
  lost: "bg-navy-50 text-navy-500 border-navy-200",
};

function Select({ status }: { status: LeadStatus }) {
  const { pending } = useFormStatus();
  const form = useRef<HTMLSelectElement>(null);

  return (
    <select
      ref={form}
      name="status"
      defaultValue={status}
      disabled={pending}
      aria-label="Lead status"
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className={`rounded-md border px-2 py-1 text-sm font-medium disabled:opacity-50 ${STYLES[status]}`}
    >
      {LEAD_STATUSES.map((value) => (
        <option key={value} value={value}>
          {LABELS[value]}
        </option>
      ))}
    </select>
  );
}

export function StatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  return (
    <form action={updateStatus}>
      <input type="hidden" name="id" value={id} />
      <Select status={status} />
    </form>
  );
}
