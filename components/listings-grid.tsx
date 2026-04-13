"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { Listing } from "@/lib/listings";
import { getStoredListings } from "@/lib/storage";

type ListingsGridProps = {
  isAdmin: boolean;
};

export function ListingsGrid({ isAdmin }: ListingsGridProps) {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(getStoredListings());
  }, []);

  return (
    <section className="shell">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-card sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Simple & Clean</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            Find your next property
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Browse clean, easy-to-scan listings with clear price, status, and image previews.
          </p>
        </div>
        <div className="rounded-2xl bg-brand-soft px-5 py-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Total Listings</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{listings.length}</p>
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} isAdmin={isAdmin} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-12 text-center text-slate-500">
          No listings yet. Add your first one from the admin page.
        </div>
      )}
    </section>
  );
}
