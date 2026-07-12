"use client";
import { useState } from "react";
import type { UserEleve, ExerciceAssignable } from "@/lib/types";
import exercicesData from "@/data/exercices.json";

const DIFF_COLOR: Record<string, string> = {
  debutant: "bg-accent-soft text-accent",
  intermediaire: "bg-warn-soft text-warn",
  avance: "bg-danger-soft text-danger",
};

interface Props {
  eleve: UserEleve;
  onAssigne: (id: string) => void;
  onAnnuler: () => void;
}

export function ExerciseAssigner({ eleve, onAssigne, onAnnuler }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const exercices = exercicesData as ExerciceAssignable[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-modal animate-fade-up">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Assigner un exercice</h2>
          <p className="text-xs text-text-2 mt-0.5">Pour : {eleve.prenom} {eleve.nom}</p>
        </div>
        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
          {exercices.map(ex => (
            <button key={ex.id} onClick={() => setSel(ex.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${sel === ex.id ? "border-accent bg-accent-soft" : "border-border hover:border-text-3"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-medium text-text text-sm">{ex.titre}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLOR[ex.difficulte]}`}>{ex.difficulte}</span>
              </div>
              <p className="text-xs text-text-2">{ex.description}</p>
            </button>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
          <button onClick={onAnnuler} className="px-4 py-2 text-sm text-text-2 hover:text-text transition-colors">Annuler</button>
          <button onClick={() => sel && onAssigne(sel)} disabled={!sel}
            className="px-4 py-2 text-sm bg-accent text-white rounded-xl font-medium hover:bg-accent-dark disabled:opacity-50 transition-all"
          >
            Assigner
          </button>
        </div>
      </div>
    </div>
  );
}
