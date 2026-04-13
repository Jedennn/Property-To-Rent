import clsx from "clsx";
import { ListingStatus } from "@/lib/listings";

type StatusBadgeProps = {
  status: ListingStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
        status === "available"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      )}
    >
      {status}
    </span>
  );
}
