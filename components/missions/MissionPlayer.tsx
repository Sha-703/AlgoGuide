"use client";
import { useState, useEffect } from "react";
import type { Mission } from "@/lib/types";
import { calculerScore } from "@/lib/score-calculator";

interface Props { mission: Mission; missionIndex: number; onTermine: (score: number, badge: Mission["badge"]) => void; onRetour: () => void; }

export function MissionPlayer({ mission, missionIndex, onTermine, onRetour }: Props) {
  const [choix, setChoix] = useState<number | null>(null);
  const [trous, setTrous] = useState<Record<string, string>>({});
  const [valide, setValide] = useState(false);
  const [debut] = useState(Date.now());
  const [tps, setTps] = useState(0);
  const ex = mission.exercice;

  useEffect(() => {
    if (valide) return;
    const t = setInterval(() => setTps(Math.floor((Date.now() - debut) / 1000)), 1000);
    return () => clearInterval(t);
  }, [valide, debut]);

  const correct = () => {
    if (ex.type === "qcm") return choix === ex.bonneReponse;
    if (ex.type === "trous") return (ex.trous ?? []).every(t => trous[t.id]?.trim().toLowerCase() === t.reponse.toLowerCase());
    return false;
  };

  function valider() {
    setValide(true);
    if (correct()) {
      const res = calculerScore(mission.pointsMax, tps, 120, missionIndex);
      setTimeout(() => onTermine(res.total, mission.badge), 1200);
    }
  }

  const ok = valide && correct(); const ko = valide && !correct();

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Contexte */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{mission.badge.emoji}</span>
          <div>
            <h2 className="font-semibold text-text">{mission.titre}</h2>
            <p className="text-xs text-text-3 font-mono">📍 {mission.contexte}</p>
          </div>
        </div>
        <p className="text-sm text-text-2 leading-relaxed italic">&ldquo;{mission.narrative}&rdquo;</p>
      </div>

      {/* Chrono + bonus */}
      <div className="flex items-center justify-between text-xs text-text-2">
        <span className="font-mono">⏱ {tps}s</span>
        <span className="font-mono">{tps < 60 ? "Bonus +30 pts si tu finis vite !" : tps < 90 ? "Bonus +15 pts encore possible" : "Pas de bonus rapidité"}</span>
      </div>

      {/* Exercice */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <p className="font-medium text-text">{ex.enonce}</p>
        <pre className="bg-[#1E1E2E] text-green-300 font-mono text-sm rounded-xl p-4 overflow-x-auto">{ex.code}</pre>

        {ex.type === "qcm" && (
          <div className="space-y-2">
            {(ex.choix ?? []).map((opt, i) => (
              <button key={i} onClick={() => !valide && setChoix(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  valide && i === ex.bonneReponse ? "border-accent bg-accent-soft text-accent"
                  : valide && choix === i && i !== ex.bonneReponse ? "border-danger bg-danger-soft text-danger"
                  : !valide && choix === i ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-text-2 hover:border-text-3"
                }`}
              >
                <span className="font-mono text-text-3 mr-2">{String.fromCharCode(65+i)}.</span>{opt}
              </button>
            ))}
          </div>
        )}

        {ex.type === "trous" && (
          <div className="space-y-3">
            {(ex.trous ?? []).map(trou => (
              <div key={trou.id} className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-text-2">Complète :</span>
                {trou.options.map(opt => (
                  <button key={opt} onClick={() => !valide && setTrous((r: Record<string, string>) => ({...r, [trou.id]: opt}))}
                    className={`px-3 py-1.5 rounded-xl border font-mono text-sm transition-all ${trous[trou.id] === opt ? "border-accent bg-accent-soft text-accent" : "border-border text-text-2 hover:border-text-3"}`}
                  >{opt}</button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {ok && <div className="bg-accent-soft border border-accent-border rounded-xl p-4 text-accent text-sm">🎉 Bravo ! Calcul du score…</div>}
      {ko && <div className="bg-danger-soft border border-red-200 rounded-xl p-4 text-danger text-sm">✗ Pas tout à fait… Réessaie !</div>}

      <div className="flex items-center gap-3">
        <button onClick={onRetour} className="text-sm text-text-2 hover:text-text transition-colors">← Retour</button>
        <div className="flex-1" />
        {!valide
          ? <button onClick={valider} disabled={ex.type === "qcm" ? choix === null : Object.keys(trous).length === 0}
              className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-accent-dark transition-all">
              Valider
            </button>
          : ko
          ? <button onClick={() => { setValide(false); setChoix(null); setTrous({}); }}
              className="px-5 py-2.5 bg-surface border border-border text-text rounded-xl text-sm font-medium hover:border-accent transition-all">
              Réessayer
            </button>
          : null
        }
      </div>
    </div>
  );
}
