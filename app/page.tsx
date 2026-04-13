import { isAdminSession } from "@/lib/auth";
import { ListingsGrid } from "@/components/listings-grid";

export default function HomePage() {
  return <ListingsGrid isAdmin={isAdminSession()} />;
}
