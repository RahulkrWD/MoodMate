import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export function WizardProgress({ steps, currentIndex }) {
  return (
    <div className="mx-auto mb-10 flex w-full max-w-md items-center">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < currentIndex && "bg-brand-600 text-white",
                i === currentIndex && "bg-brand-600 text-white ring-4 ring-brand-100",
                i > currentIndex && "bg-brand-100 text-brand-400",
              )}
            >
              {i < currentIndex ? <Check className="size-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                i <= currentIndex ? "text-slate-700" : "text-slate-400",
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-2 h-0.5 flex-1 rounded-full transition-colors",
                i < currentIndex ? "bg-brand-600" : "bg-brand-100",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
