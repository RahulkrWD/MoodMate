import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-sm font-medium",
            p === page ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100",
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
