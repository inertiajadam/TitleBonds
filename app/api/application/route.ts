import { deliverApplication, parseApplication } from "@/lib/applications";

/**
 * Bond applications. Nothing is persisted here and nothing personal is logged:
 * the payload goes straight to the configured destination or nowhere at all.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).company) {
    return Response.json({ ok: true });
  }

  const application = parseApplication(body);
  if (!application) return Response.json({ error: "invalid" }, { status: 400 });

  const result = await deliverApplication(application);
  if (result.ok) return Response.json({ ok: true });

  // 503 rather than 500: the request was fine, we cannot accept it yet.
  return Response.json({ error: result.reason }, { status: 503 });
}
