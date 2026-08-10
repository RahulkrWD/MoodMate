import { cn } from "../../lib/cn";

export function OptionTile({ selected, onClick, icon: Icon, label, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-2xl border-2 p-4 text-center transition-all",
        selected
          ? "border-brand-500 bg-brand-50 shadow-sm shadow-brand-500/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500",
          )}
        >
          <Icon className="size-5" />
        </span>
      )}
      <span
        className={cn(
          "text-sm font-medium",
          selected ? "text-brand-700" : "text-slate-700",
        )}
      >
        {label}
      </span>
    </button>
  );
}
