import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

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
