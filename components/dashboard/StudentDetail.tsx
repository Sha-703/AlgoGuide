"use client";
import type { UserEleve, ProgressionEleve } from "@/lib/types";

interface Props {
  eleve: UserEleve;
  progression: ProgressionEleve;
  onAssigner: () => void;
  onFermer: () => void;
}

export function StudentDetail({ eleve, progression, onAssigner, onFermer }: Props) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-5 shadow-card animate-slide-in h-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-soft border border-accent-border flex items-center justify-center text-accent font-bold">
            {eleve.prenom.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-text">{eleve.prenom} {eleve.nom}</div>
            <div className="text-xs text-text-2">{eleve.classe} · {eleve.ecole}</div>
          </div>
        </div>
        <button onClick={onFermer} className="text-text-3 hover:text-text text-xl leading-none transition-colors">×</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Score", value: progression.score, unit: "pts", color: "text-accent" },
          { label: "Missions", value: progression.missionsCompletees.length, unit: "/ 6", color: "text-primary" },
          { label: "Tentatives", value: progression.tentatives, unit: "", color: "text-warn" },
        ].map(s => (
          <div key={s.label} className="bg-bg border border-border rounded-lg p-3 text-center">
            <div className={`text-xl font-mono font-bold ${s.color}`}>{s.value}<span className="text-xs text-text-3 ml-0.5">{s.unit}</span></div>
            <div className="text-xs text-text-2 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progression */}
      <div className="space-y-2.5">
        {[
          { label: "AlgoStep", pct: progression.algoStepPct },
          { label: "AlgoQuest", pct: progression.algoQuestPct },
        ].map(p => (
          <div key={p.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-2 font-medium">{p.label}</span>
              <span className="font-mono text-text-2">{p.pct}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${p.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Exercices ratés */}
      {progression.exercicesRates.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-2 uppercase tracking-wide mb-2">À retravailler</p>
          <div className="flex flex-wrap gap-1.5">
            {progression.exercicesRates.map(ex => (
              <span key={ex} className="text-xs bg-danger-soft text-danger border border-red-200 px-2 py-0.5 rounded-full font-medium">
                {ex.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-text-3 font-mono">Dernière activité : {progression.derniereActivite}</div>

      <button
        onClick={onAssigner}
        className="w-full py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
      >
        Assigner un exercice →
      </button>
    </div>
  );
}
