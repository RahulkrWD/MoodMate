import { Skeleton } from "../ui/Skeleton";
import { Card } from "../ui/Card";

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-8 h-8 w-40" />

      <Card className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Skeleton className="size-20 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="mx-auto mb-2 h-5 w-32 sm:mx-0" />
          <Skeleton className="mx-auto h-3.5 w-40 sm:mx-0" />
        </div>
      </Card>

      <Card>
        <Skeleton className="mb-4 h-3.5 w-16" />
        <Skeleton className="h-4 w-56" />
      </Card>
    </div>
  );
}
