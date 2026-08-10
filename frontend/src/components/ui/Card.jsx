import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
