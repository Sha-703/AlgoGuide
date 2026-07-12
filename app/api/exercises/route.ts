import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

// POST /api/exercises/assign - Assigner un exercice à un élève
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eleveId, exerciceId } = body;

    if (!eleveId || !exerciceId) {
      return NextResponse.json({ ok: false, error: "eleveId et exerciceId requis." });
    }

    const db = await readDb();
    db.progressions = db.progressions || [];

    // Trouver la progression de l'élève
    const progIndex = db.progressions.findIndex((p: any) => p.eleveId === eleveId);

    if (progIndex === -1) {
      return NextResponse.json({ ok: false, error: "Progression de l'élève introuvable." });
    }

    const prog = db.progressions[progIndex];
    prog.exercicesAssignes = prog.exercicesAssignes || [];

    // Vérifier si l'exercice est déjà assigné
    const alreadyAssigned = prog.exercicesAssignes.find((ex: any) => ex.exerciceId === exerciceId);
    if (alreadyAssigned) {
      return NextResponse.json({ ok: false, error: "Cet exercice est déjà assigné à cet élève." });
    }

    // Ajouter l'exercice assigné
    prog.exercicesAssignes.push({
      exerciceId,
      assigneLe: new Date().toISOString(),
      termine: false,
    });

    db.progressions[progIndex] = prog;
    await writeDb(db);

    return NextResponse.json({ ok: true, message: "Exercice assigné avec succès." });
  } catch (error) {
    console.error("Erreur assign-exercise:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
}

// GET /api/exercises/:eleveId - Récupérer les exercices assignés à un élève
export async function GET(req: NextRequest, { params }: { params: { eleveId: string } }) {
  try {
    const { eleveId } = params;
    const db = await readDb();
    db.progressions = db.progressions || [];

    const prog = db.progressions.find((p: any) => p.eleveId === eleveId);

    if (!prog) {
      return NextResponse.json({ ok: true, data: [] });
    }

    return NextResponse.json({ ok: true, data: prog.exercicesAssignes || [] });
  } catch (error) {
    console.error("Erreur get-exercises:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur." });
  }
}

// PATCH /api/exercises/complete - Marquer un exercice comme terminé
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { eleveId, exerciceId } = body;

    if (!eleveId || !exerciceId) {
      return NextResponse.json({ ok: false, error: "eleveId et exerciceId requis." });
    }

    const db = await readDb();
    db.progressions = db.progressions || [];

    const progIndex = db.progressions.findIndex((p: any) => p.eleveId === eleveId);

    if (progIndex === -1) {
      return NextResponse.json({ ok: false, error: "Progression de l'élève introuvable." });
    }

    const prog = db.progressions[progIndex];
    prog.exercicesAssignes = prog.exercicesAssignes || [];

    // Marquer l'exercice comme terminé
    const exIndex = prog.exercicesAssignes.findIndex((ex: any) => ex.exerciceId === exerciceId);
    if (exIndex === -1) {
      return NextResponse.json({ ok: false, error: "Exercice non trouvé." });
    }

    prog.exercicesAssignes[exIndex].termine = true;
    db.progressions[progIndex] = prog;
    await writeDb(db);

    return NextResponse.json({ ok: true, message: "Exercice marqué comme terminé." });
  } catch (error) {
    console.error("Erreur complete-exercise:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur." });
  }
}