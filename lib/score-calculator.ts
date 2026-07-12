import type { Badge } from "./types";

export interface ResultatScore {
  points: number;
  bonusRapidite: number;
  total: number;
  badge?: Badge;
  message: string;
}

const BADGES: Badge[] = [
  { id: "commercant",   nom: "Commerçant Numérique",  emoji: "🛒", description: "Maîtrise de la boucle POUR au marché de Kinshasa" },
  { id: "agronome",     nom: "Ingénieur des Champs",  emoji: "🌽", description: "Boucle TANT QUE maîtrisée — champ de maïs récolté !" },
  { id: "banquier",     nom: "Banquier Mobile",        emoji: "📱", description: "Conditions SI/SINON maîtrisées — paiement sécurisé !" },
  { id: "educateur",    nom: "Éducateur de Lubumbashi",emoji: "🎓", description: "Calcul de moyenne réussi à l'école de Lubumbashi" },
  { id: "ingenieur",    nom: "Ingénieur des Routes",   emoji: "🛣️", description: "Optimisation de trajet réussie sur la route de Goma" },
  { id: "organisateur", nom: "Organisateur du Festival",emoji: "🎪", description: "Gestion de billetterie réussie au Festival de Brazzaville" },
];

export function calculerScore(
  pointsBase: number,
  tempsSecondes: number,
  tempsLimiteSecondes: number,
  missionIndex: number
): ResultatScore {
  const bonusRapidite =
    tempsSecondes < tempsLimiteSecondes * 0.5
      ? 30
      : tempsSecondes < tempsLimiteSecondes * 0.75
      ? 15
      : 0;

  const total = Math.min(pointsBase + bonusRapidite, 130);
  const badge = missionIndex >= 0 && missionIndex < BADGES.length ? BADGES[missionIndex] : undefined;

  const message =
    total >= 120
      ? "🏆 Exceptionnel ! Tu es un vrai algorithmic !"
      : total >= 90
      ? "⭐ Très bien ! Continue comme ça !"
      : total >= 60
      ? "👍 Bien joué ! Encore un effort !"
      : "💪 Courage ! Tu peux mieux faire !";

  return { points: pointsBase, bonusRapidite, total, badge, message };
}

export function niveauDepuisScore(score: number): string {
  if (score >= 500) return "Expert";
  if (score >= 300) return "Avancé";
  if (score >= 150) return "Intermédiaire";
  return "Débutant";
}

export function couleurNiveau(niveau: string): string {
  switch (niveau) {
    case "Expert":       return "text-accent-yellow";
    case "Avancé":       return "text-brand-green";
    case "Intermédiaire":return "text-accent-blue";
    default:             return "text-brand-muted";
  }
}
