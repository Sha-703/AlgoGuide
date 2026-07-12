interface ProgressBarProps { value: number; label?: string; showValue?: boolean; color?: "green"|"blue"|"yellow"|"red"; size?: "sm"|"md"; }
const C: Record<string, string> = { green: "bg-accent", blue: "bg-primary", yellow: "bg-warn", red: "bg-danger" };
export function ProgressBar({ value, label, showValue = true, color = "green", size = "md" }: ProgressBarProps) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-text-2">{label}</span>}
          {showValue && <span className="text-xs font-mono text-text-2">{v}%</span>}
        </div>
      )}
      <div className={`w-full bg-border rounded-full overflow-hidden ${size === "sm" ? "h-1.5" : "h-2"}`}>
        <div className={`h-full rounded-full transition-all duration-700 ${C[color]}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
