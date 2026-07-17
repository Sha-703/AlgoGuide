import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

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
