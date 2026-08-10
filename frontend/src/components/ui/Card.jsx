import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-900/[0.03]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
