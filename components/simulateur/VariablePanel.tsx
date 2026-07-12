"use client";
interface Props { variables: Record<string, number|string|boolean>; historique: string[]; }
export function VariablePanel({ variables, historique }: Props) {
  return (
    <div className="space-y-3">
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
        <h3 className="text-xs font-semibold text-text-2 uppercase tracking-wide mb-3">Variables</h3>
        {Object.keys(variables).length === 0
          ? <p className="text-xs text-text-3 italic">Aucune variable</p>
          : <div className="space-y-1.5">
              {Object.entries(variables).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1 border-b border-border-soft last:border-0">
                  <span className="font-mono text-sm text-primary">{k}</span>
                  <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                    typeof v === "number" ? "bg-warn-soft text-warn"
                    : typeof v === "boolean" ? "bg-danger-soft text-danger"
                    : "bg-accent-soft text-accent"
                  }`}>{String(v)}</span>
                </div>
              ))}
            </div>
        }
      </div>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
        <h3 className="text-xs font-semibold text-text-2 uppercase tracking-wide mb-3">Historique</h3>
        {historique.length === 0
          ? <p className="text-xs text-text-3 italic">Lance l&apos;exécution</p>
          : <div className="space-y-1 max-h-48 overflow-y-auto">
              {historique.map((msg, i) => (
                <div key={i} className={`text-xs font-mono px-2 py-1 rounded ${
                  i === historique.length - 1 ? "bg-accent-soft text-accent" : "text-text-2"
                }`}>
                  <span className="text-text-3 mr-1">{i + 1}.</span>{msg}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
