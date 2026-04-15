import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { isAdminSession } from "@/lib/auth";
import { ListingDetail } from "@/components/listing-detail";
import { getListingById } from "@/lib/server-listings";

type ListingPageProps = {
  params: {
    id: string;
  };
};

export default async function ListingPage({ params }: ListingPageProps) {
  noStore();

  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  return <ListingDetail listing={listing} isAdmin={isAdminSession()} />;
}
