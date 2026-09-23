"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminIsConfigured,
  endSession,
  hasValidSession,
  passwordMatches,
  startSession,
} from "@/lib/admin-auth";
import { isLeadStatus } from "@/lib/lead-status";
import { setLeadStatus } from "@/lib/leads-store";

/**
 * A deliberate delay on every login attempt, right or wrong.
 *
 * There is no shared store to rate-limit against on serverless, so this is
 * what is honestly available: it makes guessing slow without pretending to be
 * a lockout. It runs on success too, so the timing says nothing about whether
 * the password was close.
 */
const LOGIN_DELAY_MS = 600;

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  await new Promise((resolve) => setTimeout(resolve, LOGIN_DELAY_MS));

  if (!adminIsConfigured()) {
    return { error: "The admin is not configured on this deployment." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    return { error: "That password is not right." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export async function updateStatus(formData: FormData): Promise<void> {
  // Re-checked here rather than trusted from the page that rendered the form:
  // a server action is its own entry point and is reachable without it.
  if (!(await hasValidSession())) redirect("/admin/login");

  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || typeof status !== "string" || !isLeadStatus(status)) {
    throw new Error("Invalid status update");
  }

  await setLeadStatus(id, status);
  revalidatePath("/admin");
}
