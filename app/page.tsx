"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  registerEnseignant, loginEnseignant,
  registerEleve, loginEleve,
  getClassesFromCode,
  setCurrentUser,
} from "@/lib/auth";

type Vue = "accueil" | "eleve-login" | "eleve-register" | "prof-login" | "prof-register";

export default function HomePage() {
  const router = useRouter();
  const [vue, setVue] = useState<Vue>("accueil");
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🧮</span>
            <span className="font-bold text-text text-base tracking-tight">AlgoGuide</span>
          </div>
          <span className="text-xs text-text-3 font-mono hidden sm:block">RDC & Congo · Plateforme éducative</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {vue === "accueil"        && <Accueil onChoix={setVue} />}
        {vue === "eleve-login"    && <EleveLogin    onBack={() => setVue("accueil")} onSwitch={() => setVue("eleve-register")} router={router} />}
        {vue === "eleve-register" && <EleveRegister onBack={() => setVue("accueil")} onSwitch={() => setVue("eleve-login")}    router={router} />}
        {vue === "prof-login"     && <ProfLogin     onBack={() => setVue("accueil")} onSwitch={() => setVue("prof-register")}  router={router} />}
        {vue === "prof-register"  && <ProfRegister  onBack={() => setVue("accueil")} onSwitch={() => setVue("prof-login")}     router={router} />}
      </main>
      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs text-text-3">AlgoGuide · Fait pour les élèves de RDC & Congo 🌍</p>
      </footer>
    </div>
  );
}

/* ── Accueil ── */
function Accueil({ onChoix }: { onChoix: (v: Vue) => void }) {
  return (
    <div className="w-full max-w-4xl animate-fade-up">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent-soft border border-accent-border rounded-full px-3 py-1 text-xs text-accent font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Plateforme éducative
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight mb-4 leading-tight">
          Apprends les<br /><span className="text-accent">algorithmes</span> à ton rythme
        </h1>
        <p className="text-text-2 text-lg max-w-md mx-auto leading-relaxed">
          Simule, joue, progresse — une plateforme conçue pour les élèves et enseignants d&apos;Afrique centrale.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        <button onClick={() => onChoix("eleve-login")}
          className="group bg-surface border border-border rounded-2xl p-7 text-left hover:border-accent hover:shadow-card transition-all duration-200">
          <div className="w-11 h-11 bg-accent-soft rounded-xl flex items-center justify-center text-xl mb-4">🎓</div>
          <div className="font-bold text-text text-lg mb-1">Je suis élève</div>
          <div className="text-sm text-text-2 leading-relaxed">Accède aux modules, complète des missions et suis ta progression.</div>
          <div className="mt-4 text-xs text-accent font-medium group-hover:underline">Connexion →</div>
        </button>
        <button onClick={() => onChoix("prof-login")}
          className="group bg-surface border border-border rounded-2xl p-7 text-left hover:border-primary hover:shadow-card transition-all duration-200">
          <div className="w-11 h-11 bg-primary-soft rounded-xl flex items-center justify-center text-xl mb-4">👨‍🏫</div>
          <div className="font-bold text-text text-lg mb-1">Je suis enseignant</div>
          <div className="text-sm text-text-2 leading-relaxed">Suis la progression de tes élèves et assigne des exercices ciblés.</div>
          <div className="mt-4 text-xs text-primary font-medium group-hover:underline">Connexion →</div>
        </button>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-3 max-w-xl mx-auto text-center">
        {[
          { emoji: "⚡", label: "AlgoStep",   desc: "Simulateur pas-à-pas" },
          { emoji: "🎯", label: "AlgoQuest",  desc: "6 missions gamifiées" },
          { emoji: "📊", label: "AlgoCollab", desc: "Dashboard enseignant" },
        ].map(m => (
          <div key={m.label} className="bg-surface border border-border rounded-xl p-4">
            <div className="text-2xl mb-2">{m.emoji}</div>
            <div className="font-semibold text-text text-sm">{m.label}</div>
            <div className="text-xs text-text-3 mt-0.5">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Élève : CONNEXION (prenom + nom + classe — sans code) ── */
function EleveLogin({ onBack, onSwitch, router }: { onBack: () => void; onSwitch: () => void; router: ReturnType<typeof useRouter> }) {
  const [f, setF] = useState({ prenom: "", nom: "", classe: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    if (!f.prenom || !f.nom || !f.classe) { setErr("Tous les champs sont requis."); return; }
    setLoading(true); setErr("");
    loginEleve(f.prenom, f.nom, f.classe).then(res => {
      if (!res.ok) { setErr(res.error!); setLoading(false); return; }
      setCurrentUser(res.user!);
      router.push("/simulateur");
    });
  }

  return (
    <FormCard title="Connexion élève" icon="🎓" accent="accent" onBack={onBack}
      switchLabel="Pas encore inscrit ? Créer un compte" onSwitch={onSwitch}
      onSubmit={submit} submitLabel="Se connecter" loading={loading} error={err}>
      <div className="bg-accent-soft border border-accent-border rounded-xl px-4 py-3 text-xs text-accent">
        💡 Entre ton prénom, ton nom et ta classe — c&apos;est tout !
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" value={f.prenom} onChange={v => setF({...f, prenom: v})} placeholder="Amara" />
        <Field label="Nom"    value={f.nom}    onChange={v => setF({...f, nom: v})}    placeholder="Diallo" />
      </div>
      <Field label="Classe" value={f.classe} onChange={v => setF({...f, classe: v})}
        placeholder="Ex : 6ème A" hint="Exactement comme tu l'as choisie lors de ton inscription" />
    </FormCard>
  );
}

/* ── Élève : INSCRIPTION (code enseignant requis une seule fois) ── */
function EleveRegister({ onBack, onSwitch, router }: { onBack: () => void; onSwitch: () => void; router: ReturnType<typeof useRouter> }) {
  const [f, setF] = useState({ prenom: "", nom: "", code: "", classe: "" });
  const [classes, setClasses] = useState<string[]>([]);
  const [codeStatut, setCodeStatut] = useState<"idle" | "ok" | "erreur">("idle");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Vérifie le code dès qu'il fait au moins 7 caractères (ex: LYC-AB12)
  useEffect(() => {
    if (f.code.length < 7) { setClasses([]); setCodeStatut("idle"); return; }
    setCodeStatut("idle"); // reset en attendant la réponse
    getClassesFromCode(f.code).then(res => {
      if (res.ok) {
        setClasses(res.classes!);
        setCodeStatut("ok");
        setErr("");
      } else {
        setClasses([]);
        setCodeStatut("erreur");
      }
    });
  }, [f.code]);

  function submit() {
    if (!f.prenom || !f.nom || !f.code || !f.classe) { setErr("Tous les champs sont requis."); return; }
    if (codeStatut !== "ok") { setErr("Code enseignant invalide."); return; }
    setLoading(true); setErr("");
    registerEleve({ prenom: f.prenom, nom: f.nom, classe: f.classe, codeEnseignant: f.code }).then(res => {
      if (!res.ok) { setErr(res.error!); setLoading(false); return; }
      setCurrentUser(res.user!);
      router.push("/simulateur");
    });
  }

  return (
    <FormCard title="Créer un compte élève" icon="🎓" accent="accent" onBack={onBack}
      switchLabel="Déjà inscrit ? Se connecter" onSwitch={onSwitch}
      onSubmit={submit} submitLabel="Créer mon compte" loading={loading} error={err}>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" value={f.prenom} onChange={v => setF({...f, prenom: v})} placeholder="Amara" />
        <Field label="Nom"    value={f.nom}    onChange={v => setF({...f, nom: v})}    placeholder="Diallo" />
      </div>

      {/* Code enseignant avec feedback en temps réel */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Code enseignant</label>
        <div className="relative">
          <input
            type="text"
            value={f.code}
            onChange={e => setF({...f, code: e.target.value.toUpperCase(), classe: ""})}
            placeholder="Ex : LYC-AB12"
            className={`w-full bg-bg border rounded-xl px-3.5 py-2.5 text-text text-sm font-mono tracking-widest uppercase placeholder:text-text-3 outline-none transition-all pr-10 ${
              codeStatut === "ok"    ? "border-accent focus:shadow-input" :
              codeStatut === "erreur"? "border-danger" :
              "border-border focus:border-accent focus:shadow-input"
            }`}
          />
          {codeStatut === "ok"     && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent text-sm">✓</span>}
          {codeStatut === "erreur" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-danger text-sm">✗</span>}
        </div>
        <p className="mt-1.5 text-xs text-text-3">
          {codeStatut === "ok"    ? <span className="text-accent">✓ Code valide — choisis ta classe ci-dessous</span> :
           codeStatut === "erreur"? <span className="text-danger">Code invalide. Vérifie-le avec ton professeur.</span> :
           "Demande ce code à ton professeur"}
        </p>
      </div>

      {/* Sélecteur de classe — apparaît dès que le code est valide */}
      <ClasseSelect classes={classes} value={f.classe} onChange={v => setF({...f, classe: v})} />
    </FormCard>
  );
}

/* ── Enseignant : connexion ── */
function ProfLogin({ onBack, onSwitch, router }: { onBack: () => void; onSwitch: () => void; router: ReturnType<typeof useRouter> }) {
  const [f, setF] = useState({ nom: "", ecole: "", mdp: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    if (!f.nom || !f.ecole || !f.mdp) { setErr("Tous les champs sont requis."); return; }
    setLoading(true); setErr("");
    loginEnseignant(f.nom, f.ecole, f.mdp).then(res => {
      if (!res.ok) { setErr(res.error!); setLoading(false); return; }
      setCurrentUser(res.user!);
      router.push("/dashboard");
    });
  }

  return (
    <FormCard title="Connexion enseignant" icon="👨‍🏫" accent="primary" onBack={onBack}
      switchLabel="Créer un compte enseignant" onSwitch={onSwitch}
      onSubmit={submit} submitLabel="Se connecter" loading={loading} error={err}>
      <Field label="Nom"          value={f.nom}   onChange={v => setF({...f, nom: v})}   placeholder="Ex : Kabongo" />
      <Field label="École"        value={f.ecole} onChange={v => setF({...f, ecole: v})} placeholder="Ex : Lycée Motema Lubumbashi" />
      <Field label="Mot de passe" value={f.mdp}   onChange={v => setF({...f, mdp: v})}   placeholder="••••••••" type="password" />
    </FormCard>
  );
}

/* ── Enseignant : inscription ── */
function ProfRegister({ onBack, onSwitch, router }: { onBack: () => void; onSwitch: () => void; router: ReturnType<typeof useRouter> }) {
  const [f, setF] = useState({ nom: "", prenom: "", ecole: "", classesRaw: "", mdp: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    if (!f.nom || !f.prenom || !f.ecole || !f.classesRaw || !f.mdp) { setErr("Tous les champs sont requis."); return; }
    const classes = f.classesRaw.split(",").map(s => s.trim()).filter(Boolean);
    if (classes.length === 0) { setErr("Entre au moins une classe."); return; }
    if (f.mdp.length < 4) { setErr("Mot de passe trop court (min 4 caractères)."); return; }
    setLoading(true); setErr("");
    registerEnseignant({ nom: f.nom, prenom: f.prenom, ecole: f.ecole, classes, motDePasse: f.mdp }).then(res => {
      if (!res.ok) { setErr(res.error!); setLoading(false); return; }
      setCurrentUser(res.user!);
      router.push("/dashboard");
    });
  }

  return (
    <FormCard title="Créer un compte enseignant" icon="👨‍🏫" accent="primary" onBack={onBack}
      switchLabel="Déjà inscrit ? Se connecter" onSwitch={onSwitch}
      onSubmit={submit} submitLabel="Créer mon compte" loading={loading} error={err}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" value={f.prenom} onChange={v => setF({...f, prenom: v})} placeholder="Jean" />
        <Field label="Nom"    value={f.nom}    onChange={v => setF({...f, nom: v})}    placeholder="Mutombo" />
      </div>
      <Field label="École" value={f.ecole} onChange={v => setF({...f, ecole: v})} placeholder="Ex : Lycée Motema Lubumbashi" />
      <Field label="Classes enseignées" value={f.classesRaw} onChange={v => setF({...f, classesRaw: v})}
        placeholder="6ème A, 6ème B, 5ème C"
        hint="Séparées par des virgules — les élèves sélectionneront leur classe lors de l'inscription" />
      <Field label="Mot de passe" value={f.mdp} onChange={v => setF({...f, mdp: v})} placeholder="••••••••" type="password" />
    </FormCard>
  );
}

/* ── Sélecteur de classe (boutons cliquables) ── */
function ClasseSelect({ classes, value, onChange }: { classes: string[]; value: string; onChange: (v: string) => void }) {
  if (classes.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Classe</label>
        <div className="w-full bg-bg border border-dashed border-border rounded-xl px-3.5 py-3 text-text-3 text-sm text-center italic">
          Les classes apparaîtront ici après avoir entré un code valide
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-up">
      <label className="block text-sm font-medium text-text mb-2">Ta classe</label>
      <div className="flex flex-wrap gap-2">
        {classes.map(c => (
          <button key={c} type="button" onClick={() => onChange(c)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              value === c
                ? "border-accent bg-accent text-white shadow-sm"
                : "border-border bg-bg text-text-2 hover:border-accent hover:text-accent"
            }`}>
            {c}
          </button>
        ))}
      </div>
      {value && <p className="mt-2 text-xs text-accent font-medium">✓ {value} sélectionnée</p>}
    </div>
  );
}

/* ── FormCard ── */
interface FormCardProps {
  title: string; icon: string; accent: "accent" | "primary";
  onBack: () => void; switchLabel: string; onSwitch: () => void;
  onSubmit: () => void; submitLabel: string; loading: boolean;
  error: string; children: React.ReactNode;
}
function FormCard({ title, icon, accent, onBack, switchLabel, onSwitch, onSubmit, submitLabel, loading, error, children }: FormCardProps) {
  const btnClass = accent === "accent" ? "bg-accent text-white hover:bg-accent-dark" : "bg-primary text-white hover:bg-blue-700";
  return (
    <div className="w-full max-w-md animate-fade-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-2 hover:text-text mb-6 transition-colors">
        ← Retour
      </button>
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
        <div className="flex items-center gap-3 mb-7">
          <span className="text-2xl">{icon}</span>
          <h1 className="font-bold text-xl text-text">{title}</h1>
        </div>
        <div className="space-y-4">{children}</div>
        {error && (
          <div className="mt-4 bg-danger-soft border border-red-200 rounded-xl px-4 py-3 text-sm text-danger">{error}</div>
        )}
        <button onClick={onSubmit} disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all ${btnClass} disabled:opacity-50`}>
          {loading ? "Chargement…" : submitLabel}
        </button>
        <button onClick={onSwitch} className="mt-4 w-full text-center text-sm text-text-2 hover:text-text transition-colors">
          {switchLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Field ── */
interface FieldProps {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; mono?: boolean; type?: string;
}
function Field({ label, value, onChange, placeholder, hint, mono, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-text text-sm placeholder:text-text-3 outline-none focus:border-accent focus:shadow-input transition-all ${mono ? "font-mono tracking-widest uppercase" : ""}`}
      />
      {hint && <p className="mt-1.5 text-xs text-text-3">{hint}</p>}
    </div>
  );
}
