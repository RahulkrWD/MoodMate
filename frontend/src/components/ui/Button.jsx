import { cloneElement, forwardRef, isValidElement } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600 shadow-sm shadow-brand-600/20",
  warm: "bg-warm-500 text-white hover:bg-warm-600 focus-visible:outline-warm-500 shadow-sm shadow-warm-500/20",
  outline:
    "border border-brand-200 text-slate-700 hover:bg-brand-50 focus-visible:outline-brand-600",
  ghost: "text-slate-600 hover:bg-brand-50 focus-visible:outline-brand-600",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    asChild = false,
    className,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  // Renders the single child element (e.g. a react-router <Link>) in place
  // of a <button>, with this button's classes merged in - avoids nesting an
  // invalid <button> inside an <a>.
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref,
      className: cn(classes, children.props.className),
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
