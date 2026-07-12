// ─── Auth & Utilisateurs ─────────────────────────────────────────────────────
export type Role = "eleve" | "enseignant";

export interface UserEleve {
  id: string;
  role: "eleve";
  nom: string;
  prenom: string;
  ecole: string;
  classe: string;
  enseignantId: string;
  createdAt: string;
}

export interface UserEnseignant {
  id: string;
  role: "enseignant";
  nom: string;
  prenom: string;
  ecole: string;
  classes: string[];   // ex: ["6ème A", "6ème B"]
  code: string;        // code unique pour rejoindre la classe
  createdAt: string;
}

export type User = UserEleve | UserEnseignant;

// ─── Progression élève (stockée séparément) ──────────────────────────────────
export interface ProgressionEleve {
  eleveId: string;
  score: number;
  missionsCompletees: string[];
  badgesDebloques: string[];
  quizScores: Record<string, number>;
  moduleEnCours: "AlgoStep" | "AlgoQuest";
  algoStepPct: number;
  algoQuestPct: number;
  exercicesRates: string[];
  tentatives: number;
  derniereActivite: string;
}

// ─── Élève enrichi pour le dashboard ─────────────────────────────────────────
export interface EleveAvecProgression extends UserEleve {
  progression: ProgressionEleve;
}

// ─── Module AlgoStep ─────────────────────────────────────────────────────────
export interface LigneAlgo {
  id: number;
  texte: string;
  type: "instruction" | "condition" | "boucle" | "fin" | "commentaire";
  indent: number;
  trou?: boolean;
  reponse?: string;
}

export interface Module {
  id: string;
  titre: string;
  description: string;
  notion: "SI_SINON" | "TANT_QUE" | "POUR";
  difficulte: "debutant" | "intermediaire" | "avance";
  algorithme: LigneAlgo[];
  variables: Record<string, number | string | boolean>;
  quiz: Question[];
}

export interface Question {
  id: string;
  enonce: string;
  choix: string[];
  bonneReponse: number;
  explication: string;
}

// ─── Mission AlgoQuest ───────────────────────────────────────────────────────
export type StatutMission = "verrouille" | "disponible" | "complete";

export interface Mission {
  id: string;
  titre: string;
  contexte: string;
  description: string;
  narrative: string;
  notion: "SI_SINON" | "TANT_QUE" | "POUR" | "MIXTE";
  difficulte: 1 | 2 | 3;
  pointsMax: number;
  badge: Badge;
  exercice: ExerciceMission;
}

export interface ExerciceMission {
  type: "qcm" | "trous" | "ordre";
  enonce: string;
  code: string;
  trous?: { id: string; options: string[]; reponse: string }[];
  choix?: string[];
  bonneReponse?: number;
}

export interface Badge {
  id: string;
  nom: string;
  emoji: string;
  description: string;
}

export interface ExerciceAssignable {
  id: string;
  titre: string;
  notion: string;
  difficulte: "debutant" | "intermediaire" | "avance";
  description: string;
}

export interface EtatInterpreteur {
  ligneActive: number;
  variables: Record<string, number | string | boolean>;
  historique: string[];
  termine: boolean;
  erreur?: string;
}
