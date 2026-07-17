import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

// POST /api/auth/save-progression - Sauvegarder une progression
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prog = body;

    const db = await readDb();
    db.progressions = db.progressions || [];

    const idx = db.progressions.findIndex((p: any) => p.eleveId === prog.eleveId);
    if (idx >= 0) {
      db.progressions[idx] = prog;
    } else {
      db.progressions.push(prog);
    }

    await writeDb(db);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur save-progression:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
}
