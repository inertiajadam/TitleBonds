import { deliverLead, parseLead } from "@/lib/leads";

/**
 * Quote submissions. Nothing is persisted here and nothing personal is logged:
 * the payload goes straight to the configured destination or nowhere at all.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Bots fill every field they find; a real person never sees this one.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).company) {
    return Response.json({ ok: true });
  }

  const lead = parseLead(body);
  if (!lead) return Response.json({ error: "invalid" }, { status: 400 });

  const result = await deliverLead(lead);
  if (result.ok) return Response.json({ ok: true });

  // 503 rather than 500: the request was fine, we cannot accept it yet.
  return Response.json({ error: result.reason }, { status: 503 });
}
