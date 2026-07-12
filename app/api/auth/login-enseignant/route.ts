import { NextRequest, NextResponse } from "next/server";
import { readDb, norm } from "@/lib/db";

// POST /api/auth/login-enseignant - Connexion enseignant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, ecole, mdp } = body;

    if (!nom || !ecole || !mdp) {
      return NextResponse.json({ ok: false, error: "Tous les champs sont requis." });
    }

    const db = await readDb();

    // Trouver l'enseignant
    const user = db.users.find((u: any) =>
      u.role === "enseignant" &&
      norm(u.nom) === norm(nom) &&
      norm(u.ecole) === norm(ecole)
    );

    if (!user) {
      return NextResponse.json({ ok: false, error: "Enseignant introuvable. Vérifie ton nom et ton école." });
    }

    // Vérifier le mot de passe
    const storedMdp = db.mdps[user.id];
    if (storedMdp !== mdp) {
      return NextResponse.json({ ok: false, error: "Mot de passe incorrect." });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Erreur login-enseignant:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
}