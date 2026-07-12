interface BadgeProps { children: React.ReactNode; variant?: "green"|"blue"|"yellow"|"red"|"gray"; size?: "sm"|"md"; }
const V: Record<string, string> = {
  green:  "bg-accent-soft text-accent border-accent-border",
  blue:   "bg-primary-soft text-primary border-blue-200",
  yellow: "bg-warn-soft text-warn border-yellow-200",
  red:    "bg-danger-soft text-danger border-red-200",
  gray:   "bg-bg text-text-2 border-border",
};
export function Badge({ children, variant = "green", size = "sm" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${V[variant]} ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}`}>
      {children}
    </span>
  );
}
