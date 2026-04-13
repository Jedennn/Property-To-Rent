"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { formatPrice, Listing } from "@/lib/listings";
import { deleteListing } from "@/lib/storage";

type ListingDetailProps = {
  listing: Listing;
  isAdmin: boolean;
};

export function ListingDetail({ listing, isAdmin }: ListingDetailProps) {
  const router = useRouter();
  const gallery = listing.images.filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setSelectedImage(gallery[0]);
  }, [listing.id]);

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${listing.title}"?`);
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    deleteListing(listing.id);
    router.push("/");
    router.refresh();
  }

  return (
    <section className="shell">
      <Link href="/" className="mb-6 inline-flex text-sm font-semibold text-slate-500 hover:text-slate-900">
        {"<- Back to listings"}
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="space-y-4">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-stone-200 shadow-card">
            <Image
              src={selectedImage}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {gallery.map((image, index) => (
              <button
                key={image + index}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative h-24 overflow-hidden rounded-2xl border ${
                  selectedImage === image ? "border-brand" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-7 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <StatusBadge status={listing.status} />
            <p className="text-sm text-slate-500">
              Listed {new Date(listing.createdAt).toLocaleDateString("en-US")}
            </p>
          </div>
          {isAdmin ? (
            <div className="mt-6 flex flex-wrap gap-3">
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
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">{listing.title}</h1>
          <p className="mt-3 text-4xl font-black text-brand">{formatPrice(listing.price)}</p>
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Description</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{listing.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
