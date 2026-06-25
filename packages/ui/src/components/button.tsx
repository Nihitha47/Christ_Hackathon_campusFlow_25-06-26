import * as React from "react";
import { cn } from "../utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
};

export function Button({ className, variant = "primary", asChild = false, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" && "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
    variant === "secondary" && "bg-slate-800 text-slate-100 hover:bg-slate-700",
    variant === "ghost" && "bg-transparent text-slate-100 hover:bg-slate-800",
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className)
    });
  }

  return (
    <button
      className={classes}
      {...props}
<<<<<<< HEAD
    >
      {children}
    </button>
=======
    />
>>>>>>> 3d549590b8362e89faeb9c442c35a3d2fc36de6a
  );
}