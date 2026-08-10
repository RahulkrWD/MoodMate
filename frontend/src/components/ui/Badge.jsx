import { cn } from "../../lib/cn";

const VARIANTS = {
  brand: "bg-brand-100 text-brand-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-100 text-slate-600",
  red: "bg-red-100 text-red-700",
};

export function Badge({ variant = "slate", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
