import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// On lit request.url (query param eleveId) : route dynamique, jamais prerender statique.
export const dynamic = 'force-dynamic';

// GET /api/auth/progression?eleveId=xxx - Récupérer la progression d'un élève.
// Renvoie une progression par défaut (vide) si l'élève n'en a pas encore, afin que
// le client ne reçoive jamais null et que les quiz restent enregistrables.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eleveId = searchParams.get("eleveId");

    if (!eleveId) {
      return NextResponse.json({ ok: false, error: "eleveId requis" });
    }

    const db = await readDb();
    const prog = (db.progressions || []).find((p: any) => p.eleveId === eleveId);

    if (!prog) {
      const defaut: ProgressionParDefaut = {
        eleveId,
        score: 0,
        missionsCompletees: [],
        badgesDebloques: [],
        quizScores: {},
        moduleEnCours: "AlgoStep",
        algoStepPct: 0,
        algoQuestPct: 0,
        exercicesRates: [],
        tentatives: 0,
        exercicesAssignes: [],
        derniereActivite: new Date().toISOString().split("T")[0],
      };
      return NextResponse.json({ ok: true, data: defaut });
    }

    return NextResponse.json({ ok: true, data: prog });
  } catch (error) {
    console.error("Erreur get-progression:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur." });
  }
}

// Type local aligné sur lib/types.ts (ProgressionEleve), sans dépendance
// pour garder ce fichier de route isolé et léger.
interface ProgressionParDefaut {
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
  exercicesAssignes: { exerciceId: string; assigneLe: string; termine: boolean }[];
  derniereActivite: string;
}
