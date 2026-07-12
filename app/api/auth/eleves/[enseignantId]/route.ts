import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// GET /api/auth/eleves/:enseignantId - Récupérer les élèves d'un enseignant
export async function GET(req: NextRequest, { params }: { params: { enseignantId: string } }) {
  try {
    const { enseignantId } = params;
    const db = await readDb();

    // Trouver tous les élèves de cet enseignant
    const eleves = db.users.filter((u: any) =>
      u.role === "eleve" &&
      u.enseignantId === enseignantId
    );

    // Associer chaque élève à sa progression
    const result = eleves.map((eleve: any) => {
      const progression = (db.progressions || []).find((p: any) => p.eleveId === eleve.id) || {
        eleveId: eleve.id,
        score: 0,
        missionsCompletees: [],
        badgesDebloques: [],
        quizScores: {},
        moduleEnCours: "AlgoStep",
        algoStepPct: 0,
        algoQuestPct: 0,
        exercicesRates: [],
        tentatives: 0,
        derniereActivite: eleve.createdAt.split("T")[0],
      };
      return { eleve, progression };
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("Erreur get-eleves:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}