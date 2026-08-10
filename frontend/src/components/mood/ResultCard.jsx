import { cn } from "../../lib/cn";

export function ResultCard({ icon: Icon, label, suggestion, variant }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br from-[var(--card-from)] to-[var(--card-to)] p-6",
        "border-[color-mix(in_srgb,var(--card-ring)_35%,transparent)]",
        variant,
      )}
    >
      <span
        className="mb-4 flex size-11 items-center justify-center rounded-full text-white"
        style={{ background: "var(--card-icon-bg)" }}
      >
        <Icon className="size-5" />
      </span>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-base font-medium leading-snug text-slate-800">{suggestion}</p>
    </div>
  );
}
