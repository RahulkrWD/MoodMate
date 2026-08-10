import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export const Select = forwardRef(function Select(
  { label, error, className, id, children, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border border-brand-200 bg-white px-4 pr-10 text-sm text-slate-900",
            "outline-none transition-shadow focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
