"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getWhatsAppUrl, Listing } from "@/lib/listings";
import { StatusBadge } from "@/components/status-badge";
import { deleteListing } from "@/lib/storage";
import { useState } from "react";

type ListingCardProps = {
  listing: Listing;
  isAdmin: boolean;
};

export function ListingCard({ listing, isAdmin }: ListingCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${listing.title}"?`);
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    deleteListing(listing.id);
    router.refresh();
    window.location.reload();
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/listing/${listing.id}`} className="group block">
        <div className="relative h-60 overflow-hidden bg-stone-200">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/listing/${listing.id}`} className="text-xl font-bold text-slate-900 hover:text-brand">
              {listing.title}
            </Link>
          </div>
          <StatusBadge status={listing.status} />
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{listing.description}</p>
        <a
          href={getWhatsAppUrl(listing.title)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Tanya Harga via WhatsApp
        </a>
        {isAdmin ? (
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/admin/${listing.id}`}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
