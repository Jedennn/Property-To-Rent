import { ListingDetailShell } from "@/components/listing-detail-shell";
import { isAdminSession } from "@/lib/auth";

type ListingPageProps = {
  params: {
    id: string;
  };
};

export default function ListingPage({ params }: ListingPageProps) {
  return <ListingDetailShell id={params.id} isAdmin={isAdminSession()} />;
}
