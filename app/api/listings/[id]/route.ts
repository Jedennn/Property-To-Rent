import { NextResponse } from "next/server";
import { Listing, ListingStatus } from "@/lib/listings";
import { isAdminSession } from "@/lib/auth";
import { getListingById, removeListing, updateListing } from "@/lib/server-listings";

type ListingPayload = {
  title?: string;
  description?: string;
  status?: ListingStatus;
  images?: string[];
  videos?: string[];
};

function normalizePayload(
  payload: ListingPayload
): Pick<Listing, "title" | "description" | "status" | "images" | "videos"> | null {
  const title = payload.title?.trim() ?? "";
  const description = payload.description?.trim() ?? "";
  const status = payload.status === "sold" ? "sold" : "available";
  const images = Array.isArray(payload.images)
    ? payload.images.map((image) => image.trim()).filter(Boolean)
    : [];
  const videos = Array.isArray(payload.videos)
    ? payload.videos.map((video) => video.trim()).filter(Boolean).slice(0, 6)
    : [];

  if (!title || !description || images.length === 0) {
    return null;
  }

  return { title, description, status, images, videos };
}

type ListingRouteProps = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: ListingRouteProps) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PUT(request: Request, { params }: ListingRouteProps) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const currentListing = await getListingById(params.id);

    if (!currentListing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    const payload = normalizePayload((await request.json()) as ListingPayload);

    if (!payload) {
      return NextResponse.json(
        { error: "Title, description, status, and at least one image are required." },
        { status: 400 }
      );
    }

    const listing = {
      ...currentListing,
      ...payload,
      id: params.id
    };

    await updateListing(params.id, listing);

    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update listing." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: ListingRouteProps) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const deleted = await removeListing(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete listing." },
      { status: 500 }
    );
  }
}
