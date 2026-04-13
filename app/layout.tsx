import type { Metadata } from "next";
import Link from "next/link";
import { AdminNavActions } from "@/components/admin-nav-actions";
import { isAdminSession } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropertyHub",
  description: "Simple property listing website built with Next.js and Tailwind CSS"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = isAdminSession();

  return (
    <html lang="en">
      <body>
        <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="shell flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
              Property<span className="text-brand">Hub</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-stone-100 hover:text-slate-900"
              >
                Listings
              </Link>
              <AdminNavActions isAdmin={isAdmin} />
            </nav>
          </div>
        </header>
        <main className="pb-14 pt-8">{children}</main>
      </body>
    </html>
  );
}
