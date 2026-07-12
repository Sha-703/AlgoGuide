"use client";
import { useState } from "react";
import type { Question } from "@/lib/types";

interface Props { questions: Question[]; onTermine: (score: number) => void; onFermer: () => void; }

export function QuizModal({ questions, onTermine, onFermer }: Props) {
  const [idx, setIdx] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [valide, setValide] = useState(false);
  const [bons, setBons] = useState(0);
  const [fini, setFini] = useState(false);
  const q = questions[idx];
  const score = Math.round((bons / questions.length) * 100);

  function valider() {
    if (choix === null) return;
    setValide(true);
    if (choix === q.bonneReponse) setBons((n: number) => n + 1);
  }
  function suivant() {
    if (idx < questions.length - 1) { setIdx((i: number) => i + 1); setChoix(null); setValide(false); }
    else setFini(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-modal animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Quiz de validation</h2>
          <span className="text-xs text-text-2 font-mono">{idx + 1} / {questions.length}</span>
        </div>
        <div className="p-6">
          {!fini ? (
            <>
              <p className="text-text font-medium mb-5 leading-relaxed">{q.enonce}</p>
              <div className="space-y-2 mb-5">
                {q.choix.map((opt, i) => (
                  <button key={i} onClick={() => !valide && setChoix(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      valide && i === q.bonneReponse ? "border-accent bg-accent-soft text-accent"
                      : valide && choix === i && i !== q.bonneReponse ? "border-danger bg-danger-soft text-danger"
                      : !valide && choix === i ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-text-2 hover:border-text-3"
                    }`}
                  >
                    <span className="font-mono text-text-3 mr-2">{String.fromCharCode(65+i)}.</span>{opt}
                  </button>
                ))}
              </div>
              {valide && (
                <div className={`px-4 py-3 rounded-xl text-sm mb-4 border ${choix === q.bonneReponse ? "bg-accent-soft border-accent-border text-accent" : "bg-danger-soft border-red-200 text-danger"}`}>
                  {choix === q.bonneReponse ? "✓ Correct ! " : "✗ Incorrect. "}{q.explication}
                </div>
              )}
              <div className="flex justify-end gap-2">
                {!valide
                  ? <button onClick={valider} disabled={choix === null} className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-accent-dark transition-colors">Valider</button>
                  : <button onClick={suivant} className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors">{idx < questions.length - 1 ? "Suivant →" : "Voir le score"}</button>
                }
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="text-5xl">{score >= 67 ? "🏆" : score >= 33 ? "⭐" : "💪"}</div>
              <div className="text-4xl font-bold text-accent font-mono">{score}%</div>
              <p className="text-text-2 text-sm">{bons} bonne{bons > 1 ? "s" : ""} réponse{bons > 1 ? "s" : ""} sur {questions.length}</p>
              <button onClick={() => { onTermine(score); onFermer(); }} className="w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors">
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
