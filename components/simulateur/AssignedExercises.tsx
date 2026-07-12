"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ExerciceAssigne {
  exerciceId: string;
  assigneLe: string;
  termine: boolean;
}

interface ExerciceDetail extends ExerciceAssigne {
  titre?: string;
  notion?: string;
  difficulte?: string;
}

interface Props {
  eleveId: string;
}

const DIFF_COLOR: Record<string, string> = {
  debutant: "bg-accent-soft text-accent",
  intermediaire: "bg-warn-soft text-warn",
  avance: "bg-danger-soft text-danger",
};

export function AssignedExercises({ eleveId }: Props) {
  const [exercices, setExercices] = useState<ExerciceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataExercises, setDataExercises] = useState<any[]>([]);

  useEffect(() => {
    // Récupérer les exercices assignés
    fetch(`/api/exercises/${eleveId}`)
      .then(res => res.json())
      .then(result => {
        const assigned = result.data || result || [];
        setExercices(assigned);

        // Charger les détails des exercices
        fetch("/data/exercices.json")
          .then(res => res.json())
          .then(data => {
            setDataExercises(data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [eleveId]);

  // Fusionner les exercices assignés avec les détails
  const exercicesWithDetails = exercices.map(ex => {
    const detail = dataExercises.find(d => d.id === ex.exerciceId);
    return {
      ...ex,
      titre: detail?.titre || ex.exerciceId,
      notion: detail?.notion || "N/A",
      difficulte: detail?.difficulte || "inconnue",
    };
  });

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">Exercices assignés</h3>
        <p className="text-sm text-text-2">Chargement...</p>
      </div>
    );
  }

  if (exercices.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card text-center">
        <span className="text-2xl mb-2 block">📭</span>
        <p className="text-sm text-text-2">Aucun exercice assigné pour le moment</p>
        <p className="text-xs text-text-3 mt-1">Ton professeur peut t'assigner des exercices depuis le dashboard</p>
      </div>
    );
  }

  const aFaire = exercicesWithDetails.filter(ex => !ex.termine);
  const termines = exercicesWithDetails.filter(ex => ex.termine);

  return (
    <div className="space-y-4">
      {aFaire.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            À faire ({aFaire.length})
          </h3>
          <div className="space-y-2">
            {aFaire.map(ex => (
              <Link
                key={`${ex.exerciceId}-${ex.assigneLe}`}
                href={`/simulateur?exercice=${ex.exerciceId}`}
                className="block p-3 rounded-lg border border-border hover:border-accent transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-text text-sm group-hover:text-accent">{ex.titre}</span>
                  {ex.difficulte && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLOR[ex.difficulte]}`}>
                      {ex.difficulte}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-2">{ex.notion}</p>
                <p className="text-xs text-text-3 mt-1">Assigné le {new Date(ex.assigneLe).toLocaleDateString("fr-FR")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {termines.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Terminés ({termines.length})
          </h3>
          <div className="space-y-2">
            {termines.map(ex => (
              <div
                key={`${ex.exerciceId}-${ex.assigneLe}`}
                className="p-3 rounded-lg border border-border opacity-60"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-text text-sm line-through">{ex.titre}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent-soft text-accent">
                    ✓ Terminé
                  </span>
                </div>
                <p className="text-xs text-text-2">{ex.notion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}