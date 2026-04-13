import { ListingDetailShell } from "@/components/listing-detail-shell";

type ListingPageProps = {
  params: {
    id: string;
  };
};

export default function ListingPage({ params }: ListingPageProps) {
  return <ListingDetailShell id={params.id} />;
}
