import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export function Spinner({ className, size = 24 }) {
  return (
    <Loader2
      className={cn("animate-spin text-brand-600", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
