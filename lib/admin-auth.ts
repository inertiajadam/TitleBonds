import { cookies } from "next/headers";

/**
 * Access control for the leads admin.
 *
 * One shared password rather than per-user accounts. The agency is a handful
 * of people who all need the same view, and a real account system would mean
 * provisioning, resets and an invite flow before anybody could read a single
 * lead. The trade-off is recorded rather than hidden: a shared password cannot
 * tell you who looked, and revoking one person means changing it for everyone.
 * If the agency grows past that, this is the file that gets replaced.
 *
 * The cookie carries no identity, only an expiry and a signature over it, so a
 * stolen cookie is worth exactly one session and cannot be extended by editing
 * it. Both comparisons here are constant-time.
 */

const COOKIE_NAME = "tb_admin";
const SESSION_HOURS = 12;

/** Thrown at call time, not import time, so a missing var breaks the admin only. */
function requireEnv(name: "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function adminIsConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(requireEnv("ADMIN_SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function passwordMatches(candidate: string): boolean {
  return constantTimeEqual(requireEnv("ADMIN_PASSWORD"), candidate);
}

export async function startSession(): Promise<void> {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const value = `${expiry}.${await sign(String(expiry))}`;
  (await cookies()).set(COOKIE_NAME, value, {
    httpOnly: true,
    // Lax rather than Strict: Strict would drop the cookie when someone opens
    // the admin from a link in their email, which is how they will open it.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function hasValidSession(): Promise<boolean> {
  if (!adminIsConfigured()) return false;

  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const separator = raw.lastIndexOf(".");
  if (separator < 1) return false;

  const expiry = raw.slice(0, separator);
  const presented = raw.slice(separator + 1);

  // Signature first: an expired-but-valid cookie and a forged one should not be
  // distinguishable by how long this takes.
  const expected = await sign(expiry);
  if (!constantTimeEqual(expected, presented)) return false;

  const expiresAt = Number(expiry);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
