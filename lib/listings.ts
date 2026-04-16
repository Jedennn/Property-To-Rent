export type ListingStatus = "available" | "sold";

export type Listing = {
  id: string;
  title: string;
  description: string;
  status: ListingStatus;
  images: string[];
  videos?: string[];
  createdAt: string;
};

export const STORAGE_KEY = "propertyhub-listings";

export const seedListings: Listing[] = [
  {
    id: "central-park-residence",
    title: "Central Park Residence",
    description:
      "Bright 2-bedroom home with modern kitchen, large windows, and quick access to shopping, schools, and the city center.",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [],
    createdAt: "2026-04-01T08:30:00.000Z"
  },
  {
    id: "sunset-villa",
    title: "Sunset Villa",
    description:
      "Spacious family villa with private garden, airy living room, and warm neutral finishes for a relaxed everyday feel.",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [],
    createdAt: "2026-04-03T11:00:00.000Z"
  },
  {
    id: "green-view-studio",
    title: "Green View Studio",
    description:
      "Compact studio apartment with balcony view, smart layout, and easy maintenance, ideal for first-time buyers or investors.",
    status: "sold",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [],
    createdAt: "2026-03-28T09:10:00.000Z"
  }
];

export function sortListings(listings: Listing[]) {
  return [...listings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createListingId(title: string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "listing"}-${Date.now()}`;
}

export function getWhatsAppUrl(title: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  if (!phone) {
    return "#";
  }

  const normalizedPhone = phone.replace(/[^\d]/g, "");
  const message = encodeURIComponent(`Halo, saya ingin tanya harga untuk properti ${title}.`);
  return `https://wa.me/${normalizedPhone}?text=${message}`;
}
