"use client";

import { useEffect, useState } from "react";
import { Listing } from "@/lib/listings";
import { findListingById } from "@/lib/storage";
import { ListingDetail } from "@/components/listing-detail";

type ListingDetailShellProps = {
  id: string;
};

export function ListingDetailShell({ id }: ListingDetailShellProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setListing(findListingById(id) ?? null);
    setReady(true);
  }, [id]);

  if (!ready) {
    return (
      <section className="shell">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-card">
          <p className="text-slate-500">Loading listing...</p>
        </div>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="shell">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-card">
          <h1 className="text-2xl font-black text-slate-900">Listing not found</h1>
          <p className="mt-3 text-slate-600">
            The property may have been removed or was not saved in this browser yet.
          </p>
        </div>
      </section>
    );
  }

  return <ListingDetail listing={listing} />;
}
