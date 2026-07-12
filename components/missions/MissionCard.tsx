"use client";
import type { Mission, StatutMission } from "@/lib/types";
const DIFF = ["","Facile","Moyen","Difficile"];
const DIFF_C: Record<number, string> = { 1: "bg-accent-soft text-accent", 2: "bg-warn-soft text-warn", 3: "bg-danger-soft text-danger" };
const NOTION: Record<string, string> = { SI_SINON: "SI/SINON", TANT_QUE: "TANT QUE", POUR: "POUR", MIXTE: "Mixte" };

interface Props { mission: Mission; statut: StatutMission; onClick: () => void; }
export function MissionCard({ mission, statut, onClick }: Props) {
  const locked = statut === "verrouille"; const done = statut === "complete";
  return (
    <button onClick={onClick} disabled={locked}
      className={`w-full text-left bg-surface border rounded-xl p-5 transition-all duration-200 group ${
        locked ? "border-border opacity-50 cursor-not-allowed"
        : done ? "border-accent hover:shadow-card"
        : "border-border hover:border-accent hover:shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-2xl transition-transform ${!locked ? "group-hover:scale-110" : ""}`}>{locked ? "🔒" : mission.badge.emoji}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${done ? "bg-accent text-white" : locked ? "bg-bg text-text-3" : "bg-primary-soft text-primary"}`}>
          {done ? "✓ Complété" : locked ? "Verrouillé" : "Disponible"}
        </span>
      </div>
      <h3 className={`font-semibold text-text mb-0.5 group-hover:text-accent transition-colors ${locked ? "" : ""}`}>{mission.titre}</h3>
      <p className="text-xs text-text-3 font-mono mb-2">📍 {mission.contexte}</p>
      <p className="text-sm text-text-2 leading-relaxed mb-3">{mission.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_C[mission.difficulte]}`}>{DIFF[mission.difficulte]}</span>
        <span className="text-xs bg-bg border border-border text-text-2 px-2 py-0.5 rounded-full">{NOTION[mission.notion]}</span>
        <span className="text-xs text-text-3 font-mono ml-auto">{mission.pointsMax} pts</span>
      </div>
    </button>
  );
}
