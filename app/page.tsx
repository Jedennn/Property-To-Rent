import { unstable_noStore as noStore } from "next/cache";
import { ListingsGrid } from "@/components/listings-grid";
import { isAdminSession } from "@/lib/auth";
import { getListings } from "@/lib/server-listings";

export default async function HomePage() {
  noStore();

  return <ListingsGrid isAdmin={isAdminSession()} initialListings={await getListings()} />;
}
