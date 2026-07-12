import type { LigneAlgo, EtatInterpreteur } from "./types";

/**
 * Moteur d'exécution pas-à-pas d'un algorithme simplifié.
 * Supporte : SI/SINON/FIN_SI, TANT_QUE/FIN_TANT_QUE, POUR/FIN_POUR,
 *            affectation de variables, AFFICHER.
 */

type Variables = Record<string, number | string | boolean>;

// Évalue une expression simple avec les variables courantes
function evaluerExpression(expr: string, vars: Variables): number | string | boolean {
  try {
    // Remplacer les noms de variables par leurs valeurs
    let exprEval = expr.trim();
    Object.entries(vars).forEach(([k, v]) => {
      exprEval = exprEval.replace(new RegExp(`\\b${k}\\b`, "g"), JSON.stringify(v));
    });
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${exprEval})`)();
  } catch {
    return expr;
  }
}

// Parse "variable <- expression" ou "variable = expression"
function parseAffectation(ligne: string, vars: Variables): Variables | null {
  const match = ligne.match(/^(\w+)\s*(?:<-|=)\s*(.+)$/);
  if (!match) return null;
  const [, nom, expr] = match;
  const valeur = evaluerExpression(expr, vars);
  return { ...vars, [nom]: valeur };
}

export interface StepResult {
  etat: EtatInterpreteur;
  message: string;
}

/**
 * Exécute l'algorithme complet et retourne tous les états intermédiaires.
 * (Pour l'animation pas-à-pas, on pré-calcule tous les états)
 */
export function executerAlgorithme(
  lignes: LigneAlgo[],
  varsInitiales: Variables = {},
  maxIterations = 200
): StepResult[] {
  const resultats: StepResult[] = [];
  const vars: Variables = { ...varsInitiales };
  let iterCount = 0;

  // Représentation plate des lignes pour exécution
  const textes = lignes.map((l) => l.texte.trim());
  let pc = 0; // program counter

  function pousserEtat(message: string) {
    resultats.push({
      etat: {
        ligneActive: pc,
        variables: { ...vars },
        historique: [...resultats.map((r) => r.message), message].slice(-10),
        termine: false,
      },
      message,
    });
  }

  while (pc < textes.length && iterCount < maxIterations) {
    iterCount++;
    const ligne = textes[pc];

    // Commentaire → skip
    if (ligne.startsWith("//") || ligne.startsWith("#")) {
      pc++;
      continue;
    }

    // AFFICHER / ECRIRE
    if (/^(AFFICHER|ECRIRE|afficher|ecrire)\s+(.+)$/i.test(ligne)) {
      const match = ligne.match(/^(?:AFFICHER|ECRIRE|afficher|ecrire)\s+(.+)$/i);
      if (match) {
        const valeur = evaluerExpression(match[1], vars);
        pousserEtat(`Affichage : ${valeur}`);
      }
      pc++;
      continue;
    }

    // Affectation
    if (/^\w+\s*(?:<-|=)\s*.+/.test(ligne)) {
      const nouvVars = parseAffectation(ligne, vars);
      if (nouvVars) {
        const match = ligne.match(/^(\w+)\s*(?:<-|=)\s*(.+)$/);
        const nom = match![1];
        const ancienne = vars[nom];
        Object.assign(vars, nouvVars);
        pousserEtat(`${nom} : ${ancienne ?? "?"} → ${vars[nom]}`);
      }
      pc++;
      continue;
    }

    // SI condition ALORS
    if (/^SI\s+.+\s+ALORS?$/i.test(ligne)) {
      const match = ligne.match(/^SI\s+(.+)\s+ALORS?$/i);
      const condition = match ? evaluerExpression(match[1], vars) : false;
      pousserEtat(`Condition SI : ${condition ? "vraie ✓" : "fausse ✗"}`);
      if (!condition) {
        // Chercher SINON ou FIN_SI
        let depth = 1;
        pc++;
        while (pc < textes.length && depth > 0) {
          if (/^SI\b/i.test(textes[pc])) depth++;
          if (/^FIN_?SI$/i.test(textes[pc])) depth--;
          if (depth > 0 && /^SINON$/i.test(textes[pc]) && depth === 1) break;
          if (depth > 0) pc++;
        }
      } else {
        pc++;
      }
      continue;
    }

    // SINON
    if (/^SINON$/i.test(ligne)) {
      // On arrive ici seulement si le SI était vrai → skip jusqu'à FIN_SI
      let depth = 1;
      pc++;
      while (pc < textes.length && depth > 0) {
        if (/^SI\b/i.test(textes[pc])) depth++;
        if (/^FIN_?SI$/i.test(textes[pc])) depth--;
        if (depth > 0) pc++;
      }
      pc++;
      continue;
    }

    // FIN_SI
    if (/^FIN_?SI$/i.test(ligne)) {
      pc++;
      continue;
    }

    // TANT QUE condition FAIRE
    if (/^TANT\s+QUE\s+.+\s+FAIRE$/i.test(ligne)) {
      const match = ligne.match(/^TANT\s+QUE\s+(.+)\s+FAIRE$/i);
      const condition = match ? evaluerExpression(match[1], vars) : false;
      pousserEtat(`Boucle TANT QUE : ${condition ? "continue ↺" : "fin de boucle ✓"}`);
      if (!condition) {
        // Sauter jusqu'à FIN_TANT_QUE
        let depth = 1;
        pc++;
        while (pc < textes.length && depth > 0) {
          if (/^TANT\s+QUE\b/i.test(textes[pc])) depth++;
          if (/^FIN_TANT_?QUE$/i.test(textes[pc])) depth--;
          if (depth > 0) pc++;
        }
        pc++;
      } else {
        pc++;
      }
      continue;
    }

    // FIN_TANT_QUE → retourner au TANT QUE correspondant
    if (/^FIN_TANT_?QUE$/i.test(ligne)) {
      let depth = 1;
      pc--;
      while (pc >= 0 && depth > 0) {
        if (/^FIN_TANT_?QUE$/i.test(textes[pc])) depth++;
        if (/^TANT\s+QUE\b/i.test(textes[pc])) depth--;
        if (depth > 0) pc--;
      }
      continue;
    }

    // POUR i DE début À fin FAIRE
    if (/^POUR\s+\w+\s+DE\s+.+\s+À\s+.+\s+FAIRE$/i.test(ligne)) {
      const match = ligne.match(/^POUR\s+(\w+)\s+DE\s+(.+)\s+À\s+(.+)\s+FAIRE$/i);
      if (match) {
        const [, varBoucle, debut, fin] = match;
        const valDebut = evaluerExpression(debut, vars) as number;
        const valFin = evaluerExpression(fin, vars) as number;
        if (!(varBoucle in vars)) {
          vars[varBoucle] = valDebut;
        }
        const valCourante = vars[varBoucle] as number;
        if (valCourante <= valFin) {
          pousserEtat(`POUR ${varBoucle} = ${valCourante} (jusqu'à ${valFin})`);
          pc++;
        } else {
          pousserEtat(`Fin de boucle POUR (${varBoucle} = ${valCourante} > ${valFin})`);
          let depth = 1;
          pc++;
          while (pc < textes.length && depth > 0) {
            if (/^POUR\b/i.test(textes[pc])) depth++;
            if (/^FIN_POUR$/i.test(textes[pc])) depth--;
            if (depth > 0) pc++;
          }
          pc++;
          delete vars[varBoucle];
        }
      } else {
        pc++;
      }
      continue;
    }

    // FIN_POUR → incrémenter et retourner au POUR
    if (/^FIN_POUR$/i.test(ligne)) {
      // Chercher le POUR parent
      let depth = 1;
      const finPourPc = pc;
      pc--;
      while (pc >= 0 && depth > 0) {
        if (/^FIN_POUR$/i.test(textes[pc])) depth++;
        if (/^POUR\b/i.test(textes[pc])) depth--;
        if (depth > 0) pc--;
      }
      const matchPour = textes[pc].match(/^POUR\s+(\w+)\s+DE\s+(.+)\s+À\s+(.+)\s+FAIRE$/i);
      if (matchPour) {
        const varBoucle = matchPour[1];
        vars[varBoucle] = (vars[varBoucle] as number) + 1;
      }
      void finPourPc;
      continue; // re-évaluer la condition POUR
    }

    // Ligne non reconnue → skip
    pc++;
  }

  // Marquer la fin
  if (resultats.length > 0) {
    resultats[resultats.length - 1].etat.termine = true;
  } else {
    resultats.push({
      etat: { ligneActive: 0, variables: { ...vars }, historique: [], termine: true },
      message: "Algorithme terminé",
    });
  }

  return resultats;
}
