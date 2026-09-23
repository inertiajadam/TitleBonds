import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await hasValidSession()) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950">Leads</h1>
      <p className="mt-2 text-sm text-navy-700">
        This page lists customer contact details. Sign in to continue.
      </p>
      <LoginForm />
    </main>
  );
}
