import { NextResponse } from "next/server";
import { createListingId, ListingStatus } from "@/lib/listings";
import { createListing, getListings } from "@/lib/server-listings";

type ListingPayload = {
  title?: string;
  description?: string;
  status?: ListingStatus;
  images?: string[];
};

function normalizePayload(payload: ListingPayload) {
  const title = payload.title?.trim() ?? "";
  const description = payload.description?.trim() ?? "";
  const status = payload.status === "sold" ? "sold" : "available";
  const images = Array.isArray(payload.images)
    ? payload.images.map((image) => image.trim()).filter(Boolean)
    : [];

  if (!title || !description || images.length === 0) {
    return null;
  }

  return { title, description, status, images };
}

export async function GET() {
  const listings = await getListings();
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const payload = normalizePayload((await request.json()) as ListingPayload);

  if (!payload) {
    return NextResponse.json(
      { error: "Title, description, status, and at least one image are required." },
      { status: 400 }
    );
  }

  const listing = {
    id: createListingId(payload.title),
    ...payload,
    createdAt: new Date().toISOString()
  };

  await createListing(listing);

  return NextResponse.json({ listing }, { status: 201 });
}
