"use client";

import { Listing, STORAGE_KEY, seedListings, sortListings } from "@/lib/listings";

export function getStoredListings() {
  if (typeof window === "undefined") {
    return sortListings(seedListings);
  }

  try {
    const parsed = readStorage();
    if (!parsed) {
      return sortListings(seedListings);
    }

    const hasSeedIds = seedListings.some((seed) => parsed.some((listing) => listing.id === seed.id));
    return hasSeedIds ? sortListings(parsed) : sortListings([...seedListings, ...parsed]);
  } catch {
    return sortListings(seedListings);
  }
}

export function saveListing(listing: Listing) {
  const existing = getStoredListings().filter((item) => item.id !== listing.id);
  const nextListings = sortListings([listing, ...existing]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextListings));
}

export function deleteListing(id: string) {
  const nextListings = getStoredListings().filter((listing) => listing.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextListings));
}

function readStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as Listing[];
  } catch {
    return null;
  }
}

export function findListingById(id: string) {
  return getStoredListings().find((listing) => listing.id === id);
}
