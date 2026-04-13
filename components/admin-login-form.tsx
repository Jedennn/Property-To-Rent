"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setSubmitting(false);
      setError("Password salah. Coba lagi.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <section className="shell max-w-md">
      <div className="rounded-[2rem] bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Admin Only</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Admin login</h1>
        <p className="mt-3 text-slate-600">
          Halaman ini hanya untuk admin. Client biasa tidak bisa tambah, edit, atau hapus listing.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 transition focus:border-brand"
              placeholder="Enter admin password"
            />
          </label>

          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-brand px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Login as admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
