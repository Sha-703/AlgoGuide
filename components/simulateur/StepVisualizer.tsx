"use client";
interface Props { etapeActuelle: number; totalEtapes: number; message: string; enExecution: boolean; termine: boolean; }
export function StepVisualizer({ etapeActuelle, totalEtapes, message, enExecution, termine }: Props) {
  const pct = totalEtapes > 0 ? (etapeActuelle / totalEtapes) * 100 : 0;
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-2 font-mono">Étape {etapeActuelle} / {totalEtapes}</span>
        {enExecution && <span className="flex items-center gap-1.5 text-accent"><span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />En cours…</span>}
        {termine && <span className="text-accent font-medium">✓ Terminé</span>}
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className={`px-3 py-2.5 rounded-lg font-mono text-sm border min-h-[40px] transition-all ${
        termine ? "bg-accent-soft border-accent-border text-accent"
        : enExecution ? "bg-warn-soft border-yellow-200 text-warn"
        : "bg-bg border-border text-text-2"
      }`}>
        {message || "Prêt à exécuter"}
      </div>
    </div>
  );
}
