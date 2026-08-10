import { cn } from "../../lib/cn";

function initialsOf(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-2xl",
};

export function Avatar({ name, src, size = "md", className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "Avatar"}
        className={cn("rounded-full object-cover", SIZES[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700",
        SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </div>
  );
}
