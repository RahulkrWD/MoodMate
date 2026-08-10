import { Skeleton } from "../ui/Skeleton";
import { Card } from "../ui/Card";

export function HistorySkeleton() {
  return (
    <div className="flex gap-6">
      <aside className="hidden w-72 shrink-0 rounded-2xl border border-brand-100 bg-white/70 md:block">
        <div className="border-b border-brand-100 px-4 py-3">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col gap-3 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 px-1 py-1">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-4">
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="mb-1.5 h-5 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <Skeleton className="mb-4 h-4 w-28" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-16 shrink-0" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-3 w-4 shrink-0" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
