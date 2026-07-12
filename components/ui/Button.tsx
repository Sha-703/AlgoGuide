"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className = "", children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";
    const variants: Record<string, string> = {
      primary:   "bg-accent text-white hover:bg-accent-dark active:scale-95",
      secondary: "bg-surface border border-border text-text hover:border-accent hover:text-accent",
      ghost:     "text-text-2 hover:text-text hover:bg-bg",
      danger:    "bg-danger text-white hover:bg-red-700",
    };
    const sizes: Record<string, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-sm",
    };
    return (
      <button ref={ref} disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}
      >
        {loading ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />Chargement…</> : children}
      </button>
    );
  }
);
Button.displayName = "Button";
