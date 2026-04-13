"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminNavActionsProps = {
  isAdmin: boolean;
};

export function AdminNavActions({ isAdmin }: AdminNavActionsProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!isAdmin) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-stone-300 px-4 py-2 text-slate-700 transition hover:bg-stone-100"
      >
        Admin Login
      </Link>
    );
  }

  return (
    <>
      <Link href="/admin" className="rounded-full bg-brand px-4 py-2 text-white transition hover:bg-brand-dark">
        Add Listing
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-stone-300 px-4 py-2 text-slate-700 transition hover:bg-stone-100"
      >
        Logout
      </button>
    </>
  );
}
