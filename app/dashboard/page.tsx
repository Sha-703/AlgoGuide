"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { StudentTable } from "@/components/dashboard/StudentTable";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { StudentDetail } from "@/components/dashboard/StudentDetail";
import { ExerciseAssigner } from "@/components/dashboard/ExerciseAssigner";
import { getCurrentUser, getElevesDeEnseignant } from "@/lib/auth";
import type { UserEnseignant, UserEleve, ProgressionEleve } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserEnseignant | null>(null);
  const [eleves, setEleves] = useState<{ eleve: UserEleve; progression: ProgressionEleve }[]>([]);
  const [selected, setSelected] = useState<{ eleve: UserEleve; progression: ProgressionEleve } | null>(null);
  const [showAssigner, setShowAssigner] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);
  const [filtreClasse, setFiltreClasse] = useState<string>("Toutes");

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "enseignant") { router.push("/"); return; }
    const ens = u as UserEnseignant;
    setUser(ens);
    // Charger les élèves de manière async
    getElevesDeEnseignant(ens.id).then(setEleves);
  }, [router]);

  function handleAssigne(exerciceId: string) {
    setShowAssigner(false);
    setNotif(`Exercice assigné à ${selected?.eleve.prenom} ✓`);
    setTimeout(() => setNotif(null), 3000);
  }

  const classes = user ? ["Toutes", ...user.classes] : ["Toutes"];
  const elevesFiltres = filtreClasse === "Toutes"
    ? eleves
    : eleves.filter(e => e.eleve.classe === filtreClasse);

  const nbActifs = eleves.filter(e => {
    const d = new Date(e.progression.derniereActivite);
    return Date.now() - d.getTime() < 3 * 86400000;
  }).length;
  const moyenne = eleves.length
    ? Math.round(eleves.reduce((s, e) => s + e.progression.score, 0) / eleves.length)
    : 0;
  const enDiff = eleves.filter(e => e.progression.score < 100).length;

  if (!user) return null;

  return (
    <>
      <Navbar />
      {notif && (
        <div className="fixed bottom-5 right-5 z-50 bg-accent text-white px-4 py-3 rounded-xl text-sm font-medium shadow-modal animate-fade-in">
          {notif}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">Tableau de bord</h1>
            <p className="text-text-2 text-sm mt-0.5">{user.ecole}</p>
          </div>
          {/* Code de classe */}
          <div className="bg-accent-soft border border-accent-border rounded-xl px-4 py-3">
            <p className="text-xs text-text-2 mb-0.5">Code à donner aux élèves</p>
            <p className="font-mono font-bold text-accent text-lg tracking-widest">{user.code}</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Élèves inscrits", value: eleves.length,  color: "text-text" },
            { label: "Actifs (3 jours)", value: nbActifs,      color: "text-accent" },
            { label: "Score moyen",     value: `${moyenne} pts`, color: "text-primary" },
            { label: "En difficulté",   value: enDiff,          color: "text-danger" },
          ].map(k => (
            <div key={k.label} className="bg-surface border border-border rounded-xl p-4 shadow-card">
              <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
              <div className="text-xs text-text-2 mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Graphique + détail */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><ProgressChart eleves={elevesFiltres} /></div>
          <div>
            {selected ? (
              <StudentDetail
                eleve={selected.eleve}
                progression={selected.progression}
                onAssigner={() => setShowAssigner(true)}
                onFermer={() => setSelected(null)}
              />
            ) : (
              <div className="bg-surface border border-border rounded-xl h-full flex flex-col items-center justify-center text-center p-8">
                <span className="text-3xl mb-3">👆</span>
                <p className="text-sm text-text-2">Clique sur un élève pour voir son détail</p>
              </div>
            )}
          </div>
        </div>

        {/* Filtre classes */}
        <div>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h2 className="font-bold text-text">Élèves</h2>
            <div className="flex gap-1.5 flex-wrap">
              {classes.map(c => (
                <button
                  key={c}
                  onClick={() => setFiltreClasse(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filtreClasse === c
                      ? "bg-accent text-white"
                      : "bg-surface border border-border text-text-2 hover:border-accent hover:text-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="text-xs text-text-3 ml-auto">{elevesFiltres.length} élève{elevesFiltres.length > 1 ? "s" : ""}</span>
          </div>

          {elevesFiltres.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-12 text-center">
              <div className="text-3xl mb-3">📭</div>
              <p className="font-semibold text-text mb-1">Aucun élève inscrit</p>
              <p className="text-sm text-text-2">Donne ton code <span className="font-mono font-bold text-accent">{user.code}</span> aux élèves pour qu&apos;ils s&apos;inscrivent.</p>
            </div>
          ) : (
            <StudentTable
              eleves={elevesFiltres}
              onSelect={setSelected}
              selectedId={selected?.eleve.id ?? null}
            />
          )}
        </div>
      </div>

      {showAssigner && selected && (
        <ExerciseAssigner
          eleve={selected.eleve}
          onAssigne={handleAssigne}
          onAnnuler={() => setShowAssigner(false)}
        />
      )}
    </>
  );
}
