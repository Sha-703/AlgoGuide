import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, genId, genCode, norm } from "@/lib/db";

// POST /api/auth/register-enseignant - Inscrire un enseignant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, prenom, ecole, classes, motDePasse } = body;

    if (!nom || !prenom || !ecole || !classes || !motDePasse) {
      return NextResponse.json({ ok: false, error: "Tous les champs sont requis." });
    }

    const db = await readDb();

    // Vérifier si un enseignant existe déjà avec ce nom et cette école
    const exists = db.users.find((u: any) =>
      u.role === "enseignant" &&
      norm(u.nom) === norm(nom) &&
      norm(u.ecole) === norm(ecole)
    );

    if (exists) {
      return NextResponse.json({ ok: false, error: "Un enseignant avec ce nom existe déjà dans cette école." });
    }

    // Créer l'enseignant
    const user = {
      id: genId(),
      role: "enseignant",
      nom: nom.trim(),
      prenom: prenom.trim(),
      ecole: ecole.trim(),
      classes: classes.map((c: string) => c.trim()),
      code: genCode(ecole),
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder l'utilisateur
    db.users.push(user);

    // Sauvegarder le mot de passe
    db.mdps[user.id] = motDePasse;

    await writeDb(db);

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Erreur register-enseignant:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
}