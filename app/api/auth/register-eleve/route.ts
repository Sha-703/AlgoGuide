import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, genId, norm } from "@/lib/db";

// POST /api/auth/register-eleve - Inscrire un élève
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prenom, nom, classe, codeEnseignant } = body;

    if (!prenom || !nom || !classe || !codeEnseignant) {
      return NextResponse.json({ ok: false, error: "Tous les champs sont requis." });
    }

    const db = await readDb();

    // Trouver l'enseignant par son code
    const enseignant = db.users.find((u: any) =>
      u.role === "enseignant" &&
      norm(u.code) === norm(codeEnseignant)
    );

    if (!enseignant) {
      return NextResponse.json({ ok: false, error: "Code enseignant invalide. Demande-le à ton professeur." });
    }

    // Vérifier que la classe existe dans les classes de l'enseignant
    const classeCanon = enseignant.classes.find((c: string) => norm(c) === norm(classe));
    if (!classeCanon) {
      return NextResponse.json({ ok: false, error: `Classe introuvable. Disponibles : ${enseignant.classes.join(", ")}` });
    }

    // Vérifier doublon
    const doublon = db.users.find((u: any) =>
      u.role === "eleve" &&
      norm(u.nom) === norm(nom) &&
      norm(u.prenom) === norm(prenom) &&
      u.enseignantId === enseignant.id &&
      norm(u.classe) === norm(classeCanon)
    );

    if (doublon) {
      return NextResponse.json({ ok: false, error: "Ce nom existe déjà dans cette classe. Connecte-toi plutôt." });
    }

    // Créer l'élève
    const user = {
      id: genId(),
      role: "eleve",
      nom: nom.trim(),
      prenom: prenom.trim(),
      ecole: enseignant.ecole,
      classe: classeCanon,
      enseignantId: enseignant.id,
      createdAt: new Date().toISOString(),
    };

    // Créer la progression
    const prog = {
      eleveId: user.id,
      score: 0,
      missionsCompletees: [],
      badgesDebloques: [],
      quizScores: {},
      moduleEnCours: "AlgoStep",
      algoStepPct: 0,
      algoQuestPct: 0,
      exercicesRates: [],
      tentatives: 0,
      derniereActivite: new Date().toISOString().split("T")[0],
    };

    // Sauvegarder
    db.users.push(user);
    db.progressions = db.progressions || [];
    db.progressions.push(prog);

    await writeDb(db);

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Erreur register-eleve:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
}