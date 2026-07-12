"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { AlgoEditor } from "@/components/simulateur/AlgoEditor";
import { StepVisualizer } from "@/components/simulateur/StepVisualizer";
import { VariablePanel } from "@/components/simulateur/VariablePanel";
import { AssignedExercises } from "@/components/simulateur/AssignedExercises";
import { QuizModal } from "@/components/simulateur/QuizModal";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { executerAlgorithme } from "@/lib/algo-interpreter";
import { getCurrentUser, getProgression, saveProgression } from "@/lib/auth";
import type { Module, UserEleve, ProgressionEleve } from "@/lib/types";
import modulesData from "@/data/modules.json";

const MODULES = modulesData as unknown as Module[];
const DELAI = 600;

export default function SimulateurPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exerciceId = searchParams.get("exercice");
  const [user, setUser]         = useState<UserEleve | null>(null);
  const [prog, setProg]         = useState<ProgressionEleve | null>(null);
  const [idx, setIdx]           = useState(0);
  const [enExec, setEnExec]     = useState(false);
  const [etape, setEtape]       = useState(0);
  const [ligneActive, setLigneActive] = useState(-1);
  const [vars, setVars]         = useState<Record<string, number|string|boolean>>({});
  const [hist, setHist]         = useState<string[]>([]);
  const [termine, setTermine]   = useState(false);
  const [quiz, setQuiz]         = useState(false);
  const [reponses, setReponses] = useState<Record<number, string>>({});
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const module = MODULES[idx];

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "eleve") { router.push("/"); return; }
    setUser(u as UserEleve);
    getProgression(u.id).then(p => setProg(p));
  }, [router]);

  // Marquer l'exercice comme terminé si un exercice est spécifié dans l'URL
  useEffect(() => {
    if (exerciceId && user) {
      fetch("/api/exercises/complete", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eleveId: user.id, exerciceId }),
      }).catch(console.error);
    }
  }, [exerciceId, user]);

  function reset() {
    if (ref.current) clearInterval(ref.current);
    setEnExec(false); setEtape(0); setLigneActive(-1);
    setVars({}); setHist([]); setTermine(false);
  }

  function changer(i: number) { reset(); setIdx(i); setReponses({}); }

  function executer() {
    reset();
    const etapes = executerAlgorithme(module.algorithme, module.variables);
    setEnExec(true);
    let i = 0;
    ref.current = setInterval(() => {
      if (i >= etapes.length) { clearInterval(ref.current!); setEnExec(false); setTermine(true); setLigneActive(-1); return; }
      const e = etapes[i];
      setEtape(i + 1); setLigneActive(e.etat.ligneActive);
      setVars({ ...e.etat.variables }); setHist([...e.etat.historique]);
      i++;
    }, DELAI);
  }

  function handleQuiz(score: number) {
    if (!user || !prog) return;
    const newScores = { ...prog.quizScores, [module.id]: score };
    const done = Object.keys(newScores).length;
    const newProg: ProgressionEleve = {
      ...prog,
      quizScores: newScores,
      algoStepPct: Math.round((done / MODULES.length) * 100),
      derniereActivite: new Date().toISOString().split("T")[0],
    };
    saveProgression(newProg).then(() => {
      setProg(newProg);
      setQuiz(false);
    });
  }

  if (!user || !module) return null;

  const etapes = useMemo(() => {
    return executerAlgorithme(module.algorithme, module.variables);
  }, [module]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚡</span>
            <h1 className="text-2xl font-bold text-text tracking-tight">AlgoStep</h1>
            <span className="px-2 py-0.5 bg-primary-soft text-primary text-xs font-medium rounded-full">Simulateur</span>
          </div>
          <p className="text-text-2 text-sm">Exécute les algorithmes ligne par ligne et observe les variables.</p>
        </div>

        {/* Tabs modules */}
        <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
          {MODULES.map((m, i) => (
            <button key={m.id} onClick={() => changer(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                idx === i ? "border-accent bg-accent-soft text-accent" : "border-border bg-surface text-text-2 hover:border-accent hover:text-accent"
              }`}
            >
              {i === 0 ? "🔀" : i === 1 ? "🔁" : "🔢"} {m.titre}
              {prog?.quizScores[m.id] !== undefined && (
                <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full">{prog.quizScores[m.id]}%</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h2 className="font-semibold text-text">{module.titre}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  module.difficulte === "debutant" ? "bg-accent-soft text-accent"
                  : module.difficulte === "intermediaire" ? "bg-warn-soft text-warn"
                  : "bg-danger-soft text-danger"
                }`}>{module.difficulte}</span>
              </div>
              <p className="text-sm text-text-2">{module.description}</p>
            </div>

            <AlgoEditor lignes={module.algorithme} ligneActive={ligneActive} onReponsesChange={setReponses} />

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button onClick={executer} disabled={enExec} size="md">
                {enExec ? "▶ En cours…" : "▶ Exécuter"}
              </Button>
              <Button variant="secondary" onClick={reset} disabled={enExec} size="md">↺ Réinitialiser</Button>
              {termine && !quiz && (
                <Button variant="secondary" onClick={() => setQuiz(true)} size="md" className="border-accent text-accent hover:bg-accent-soft">
                  🎯 Faire le quiz
                </Button>
              )}
              {prog?.quizScores[module.id] !== undefined && (
                <span className="ml-auto text-sm font-mono text-accent">Quiz : {prog.quizScores[module.id]}% ✓</span>
              )}
            </div>

            <StepVisualizer etapeActuelle={etape} totalEtapes={etapes.length} message={hist[hist.length-1] ?? ""} enExecution={enExec} termine={termine} />
          </div>

          <div className="space-y-4">
            <AssignedExercises eleveId={user.id} />
            <VariablePanel variables={vars} historique={hist} />
            <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
              <h3 className="text-xs font-semibold text-text-2 uppercase tracking-wide mb-3">Progression</h3>
              <div className="space-y-2">
                {MODULES.map(m => (
                  <ProgressBar key={m.id} label={m.titre} value={prog?.quizScores[m.id] ?? 0} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {quiz && <QuizModal questions={module.quiz} onTermine={handleQuiz} onFermer={() => setQuiz(false)} />}
    </>
  );
}
