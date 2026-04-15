import { promises as fs } from "fs";
import path from "path";
import { Listing, seedListings, sortListings } from "@/lib/listings";

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = "propertyhub:listings";
const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "listings.json");

function hasKvConfig() {
  return Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
}

async function readFromKv() {
  const response = await fetch(`${KV_REST_API_URL}/get/${KV_KEY}`, {
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to read listings from KV: ${response.status}`);
  }

  const data = (await response.json()) as { result: string | null; error?: string };
  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.result) {
    return null;
  }

  return JSON.parse(data.result) as Listing[];
}

async function writeToKv(listings: Listing[]) {
  const response = await fetch(`${KV_REST_API_URL}/set/${KV_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(listings)
  });

  if (!response.ok) {
    throw new Error(`Failed to write listings to KV: ${response.status}`);
  }
}

async function readFromLocalFile() {
  try {
    const raw = await fs.readFile(LOCAL_DATA_FILE, "utf8");
    return JSON.parse(raw) as Listing[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeToLocalFile(listings: Listing[]) {
  await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(listings, null, 2), "utf8");
}

export async function getListings() {
  const storedListings = hasKvConfig() ? await readFromKv() : await readFromLocalFile();
  return sortListings(storedListings?.length ? storedListings : seedListings);
}

export async function getListingById(id: string) {
  const listings = await getListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

export async function saveListings(listings: Listing[]) {
  const sortedListings = sortListings(listings);

  if (hasKvConfig()) {
    await writeToKv(sortedListings);
    return sortedListings;
  }

  await writeToLocalFile(sortedListings);
  return sortedListings;
}

export async function createListing(listing: Listing) {
  const listings = await getListings();
  const nextListings = listings.filter((item) => item.id !== listing.id);
  return saveListings([listing, ...nextListings]);
}

export async function updateListing(id: string, updates: Listing) {
  const listings = await getListings();
  const exists = listings.some((listing) => listing.id === id);

  if (!exists) {
    return null;
  }

  const nextListings = listings.map((listing) => (listing.id === id ? updates : listing));
  await saveListings(nextListings);
  return updates;
}

export async function removeListing(id: string) {
  const listings = await getListings();
  const nextListings = listings.filter((listing) => listing.id !== id);

  if (nextListings.length === listings.length) {
    return false;
  }

  await saveListings(nextListings);
  return true;
}
