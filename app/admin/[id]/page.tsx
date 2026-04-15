import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { ListingForm } from "@/components/listing-form";
import { getListingById } from "@/lib/server-listings";

type EditListingPageProps = {
  params: {
    id: string;
  };
};

export default async function EditListingPage({ params }: EditListingPageProps) {
  noStore();

  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  return <ListingForm initialListing={listing} />;
}
