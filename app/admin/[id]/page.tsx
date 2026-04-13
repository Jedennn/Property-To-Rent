import { EditListingShell } from "@/components/edit-listing-shell";

type EditListingPageProps = {
  params: {
    id: string;
  };
};

export default function EditListingPage({ params }: EditListingPageProps) {
  return <EditListingShell id={params.id} />;
}
