import { NextRequest, NextResponse } from "next/server";
import { readDb, norm } from "@/lib/db";

// POST /api/auth/login-eleve - Connexion élève
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prenom, nom, classe } = body;

    if (!prenom || !nom || !classe) {
      return NextResponse.json({ ok: false, error: "Tous les champs sont requis." });
    }

    const db = await readDb();

    // Chercher les élèves correspondants
    const candidats = db.users.filter((u: any) =>
      u.role === "eleve" &&
      norm(u.nom) === norm(nom) &&
      norm(u.prenom) === norm(prenom) &&
      norm(u.classe) === norm(classe)
    );

    if (candidats.length === 0) {
      return NextResponse.json({ ok: false, error: "Élève introuvable. Vérifie ton prénom, nom et classe, ou crée un compte." });
    }

    // Retourner le premier candidat trouvé
    return NextResponse.json({ ok: true, user: candidats[0] });
  } catch (error) {
    console.error("Erreur login-eleve:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
}