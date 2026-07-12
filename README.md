# 🧮 AlgoGuide

Plateforme éducative interactive pour apprendre les algorithmes — pensée pour les élèves et enseignants d'Afrique centrale (RDC & Congo).

---

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

```bash
# 1. Cloner ou dézipper le projet
cd algoguide

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev

# 4. Ouvrir dans le navigateur
# → http://localhost:3000
```

### Build de production
```bash
npm run build
npm start
```

---

## 📦 Structure du projet

```
algoguide/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx            # Page d'accueil / choix du rôle
│   ├── simulateur/         # Module AlgoStep
│   ├── missions/           # Module AlgoQuest
│   └── dashboard/          # Module AlgoCollab (enseignant)
│
├── components/
│   ├── ui/                 # Button, Card, Badge, ProgressBar
│   ├── simulateur/         # AlgoEditor, StepVisualizer, VariablePanel, QuizModal
│   ├── missions/           # MissionCard, MissionPlayer, ScoreBoard, BadgeDisplay
│   └── dashboard/          # StudentTable, ProgressChart, StudentDetail, ExerciseAssigner
│
├── data/                   # Données JSON mockées
│   ├── eleves.json         # 8 élèves avec progression
│   ├── modules.json        # 3 modules (SI, TANT QUE, POUR)
│   ├── missions.json       # 6 missions gamifiées
│   └── exercices.json      # 6 exercices assignables
│
└── lib/
    ├── algo-interpreter.ts # Moteur d'exécution pas-à-pas
    ├── score-calculator.ts # Calcul points et badges
    └── types.ts            # Types TypeScript
```

---

## 🎓 Les 3 modules

### ⚡ AlgoStep — Simulateur
- 3 leçons : SI/SINON, TANT QUE, POUR
- Algorithmes à trous à compléter
- Exécution animée ligne par ligne (600ms par étape)
- Panneau de variables en temps réel
- Quiz de validation (3 questions par module)

### 🎯 AlgoQuest — Missions
- 6 missions contextualisées RDC & Congo :
  - 🛒 Marché de Kinshasa
  - 🌽 Champ de Maïs (Kasaï)
  - 📱 Paiement Mobile (Lubumbashi)
  - 🎓 École de Lubumbashi
  - 🛣️ Route de Goma
  - 🎪 Festival de Brazzaville
- Système de badges débloquables
- Points + bonus rapidité
- Progression sauvegardée (localStorage)

### 📊 AlgoCollab — Dashboard Enseignant
- Vue d'ensemble : KPIs de la classe
- Tableau des 8 élèves avec indicateurs de difficulté
- Graphique de progression 7 jours (recharts)
- Détail individuel d'un élève au clic
- Assignation d'exercices (sauvegardé localement)

---

## 🛠️ Technologies

| Tech | Usage |
|------|-------|
| Next.js 14 | Framework React (App Router) |
| TypeScript | Typage statique |
| Tailwind CSS | Styles utilitaires |
| Recharts | Graphique de progression |
| Lucide React | Icônes |
| localStorage | Persistance des données côté client |

---

## 📝 Notes

- **Pas de backend** : toutes les données sont mockées en JSON statique et sauvegardées dans le localStorage du navigateur.
- **Pas de vrai login** : l'authentification est simulée (saisie du nom uniquement).
- Pour étendre avec un vrai backend : remplacer les imports JSON par des appels API (Next.js API Routes ou Supabase).

---

*AlgoGuide · Fait avec ❤️ pour les élèves de RDC & Congo 🌍*
