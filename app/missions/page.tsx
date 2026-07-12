"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { MissionCard } from "@/components/missions/MissionCard";
import { MissionPlayer } from "@/components/missions/MissionPlayer";
import { ScoreBoard } from "@/components/missions/ScoreBoard";
import { BadgeDisplay } from "@/components/missions/BadgeDisplay";
import { getCurrentUser, getProgression, saveProgression } from "@/lib/auth";
import type { Mission, StatutMission, UserEleve, ProgressionEleve } from "@/lib/types";
import missionsData from "@/data/missions.json";

const MISSIONS = missionsData as unknown as Mission[];
type Vue = "liste" | "jeu" | "resultat";

export default function MissionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserEleve | null>(null);
  const [prog, setProg] = useState<ProgressionEleve | null>(null);
  const [vue, setVue] = useState<Vue>("liste");
  const [missionActive, setMissionActive] = useState<Mission | null>(null);
  const [dernierScore, setDernierScore] = useState(0);
  const [dernierBadge, setDernierBadge] = useState<Mission["badge"] | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "eleve") { router.push("/"); return; }
    setUser(u as UserEleve);
    getProgression(u.id).then(p => setProg(p));
  }, [router]);

  function statut(m: Mission, i: number): StatutMission {
    if (!prog) return i === 0 ? "disponible" : "verrouille";
    if (prog.missionsCompletees.includes(m.id)) return "complete";
    if (i === 0 || prog.missionsCompletees.includes(MISSIONS[i-1].id)) return "disponible";
    return "verrouille";
  }

  function handleTermine(score: number, badge: Mission["badge"]) {
    if (!missionActive || !prog || !user) return;
    const newProg: ProgressionEleve = {
      ...prog,
      score: prog.score + score,
      missionsCompletees: prog.missionsCompletees.includes(missionActive.id) ? prog.missionsCompletees : [...prog.missionsCompletees, missionActive.id],
      badgesDebloques: prog.badgesDebloques.includes(badge.id) ? prog.badgesDebloques : [...prog.badgesDebloques, badge.id],
      algoQuestPct: Math.round(((prog.missionsCompletees.length + 1) / MISSIONS.length) * 100),
      derniereActivite: new Date().toISOString().split("T")[0],
      tentatives: prog.tentatives + 1,
      moduleEnCours: "AlgoQuest",
    };
    saveProgression(newProg).then(() => {
      setProg(newProg);
      setDernierScore(score); setDernierBadge(badge);
      setVue("resultat");
    });
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎯</span>
            <h1 className="text-2xl font-bold text-text tracking-tight">AlgoQuest</h1>
            <span className="px-2 py-0.5 bg-warn-soft text-warn text-xs font-medium rounded-full">Missions</span>
          </div>
          <p className="text-text-2 text-sm">6 missions contextualisées RDC & Congo. Complète-les toutes !</p>
        </div>

        {vue === "liste" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Missions", value: `${prog?.missionsCompletees.length ?? 0} / 6`, color: "text-accent" },
                  { label: "Points",   value: prog?.score ?? 0,                               color: "text-primary" },
                  { label: "Badges",   value: prog?.badgesDebloques.length ?? 0,              color: "text-warn" },
                ].map(s => (
                  <div key={s.label} className="bg-surface border border-border rounded-xl p-4 shadow-card text-center">
                    <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-text-2 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Progression globale */}
              <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-text">Progression globale</span>
                  <span className="font-mono text-accent">{prog?.algoQuestPct ?? 0}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${prog?.algoQuestPct ?? 0}%` }} />
                </div>
              </div>

              {/* Missions */}
              <div className="grid sm:grid-cols-2 gap-3">
                {MISSIONS.map((m, i) => (
                  <MissionCard key={m.id} mission={m} statut={statut(m, i)}
                    onClick={() => { if (statut(m, i) !== "verrouille") { setMissionActive(m); setVue("jeu"); }}} />
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
              <h3 className="font-semibold text-text mb-1">Mes badges</h3>
              <p className="text-xs text-text-2 mb-4">{prog?.badgesDebloques.length ?? 0} / {MISSIONS.length} débloqués</p>
              <BadgeDisplay badges={MISSIONS.map(m => m.badge)} badgesDebloques={prog?.badgesDebloques ?? []} />
            </div>
          </div>
        )}

        {vue === "jeu" && missionActive && (
          <div className="max-w-2xl mx-auto">
            <MissionPlayer mission={missionActive} missionIndex={MISSIONS.findIndex(m => m.id === missionActive.id)}
              onTermine={handleTermine} onRetour={() => setVue("liste")} />
          </div>
        )}

        {vue === "resultat" && dernierBadge && (
          <div className="max-w-md mx-auto">
            <ScoreBoard score={dernierScore} badge={dernierBadge} onContinuer={() => setVue("liste")} />
          </div>
        )}
      </div>
    </>
  );
}
