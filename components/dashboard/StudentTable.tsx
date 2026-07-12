"use client";
import type { UserEleve, ProgressionEleve } from "@/lib/types";

interface Props {
  eleves: { eleve: UserEleve; progression: ProgressionEleve }[];
  onSelect: (e: { eleve: UserEleve; progression: ProgressionEleve }) => void;
  selectedId: string | null;
}

export function StudentTable({ eleves, onSelect, selectedId }: Props) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg">
            {["Élève", "Classe", "Module", "Score", "Progression", "Dernière activité"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-2 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {eleves.map(({ eleve, progression }) => {
            const diff = progression.score < 100;
            const pct = Math.round((progression.algoStepPct + progression.algoQuestPct) / 2);
            return (
              <tr
                key={eleve.id}
                onClick={() => onSelect({ eleve, progression })}
                className={`border-b border-border-soft last:border-0 cursor-pointer transition-colors ${
                  selectedId === eleve.id ? "bg-accent-soft" : "hover:bg-bg"
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      diff ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent"
                    }`}>
                      {eleve.prenom.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-text">{eleve.prenom} {eleve.nom}</div>
                      {diff && <div className="text-xs text-danger">⚠ En difficulté</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-2">{eleve.classe}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    progression.moduleEnCours === "AlgoQuest"
                      ? "bg-primary-soft text-primary"
                      : "bg-accent-soft text-accent"
                  }`}>
                    {progression.moduleEnCours}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-text">{progression.score} pts</td>
                <td className="px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${diff ? "bg-danger" : "bg-accent"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-2 w-8 text-right">{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-text-3">{progression.derniereActivite}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
