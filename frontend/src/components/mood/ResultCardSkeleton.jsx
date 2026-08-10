import { Skeleton } from "../ui/Skeleton";

export function ResultCardSkeleton() {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6">
      <Skeleton className="mb-4 size-11 rounded-full" />
      <Skeleton className="mb-3 h-3 w-14" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
