---
name: squelette-decisions
description: "Choix techniques validés pour le squelette de projet ia-kit (stack, structure, modèles d'organisation)"
metadata:
  node_type: memory
  type: project
  originSessionId: 16f6f5fa-3c58-434f-9351-1632f5aab628
  modified: 2026-10-19T12:37:17.377Z
---

Décisions prises le 2026-10-19 pour les commandes de squelette de [[ia-kit-plugin]] (appelées par `/chef`) :
- JavaScript (pas TypeScript), React + Vite + Tailwind CSS, Node.js + Express + Sequelize, PostgreSQL.
- PostgreSQL 18 installé en local via Homebrew (service démarré, port 5432, utilisateur gwendolinedardari). PG 14 arrêté (sauvegarde ~/Documents/sauvegardes-postgres/postgres14-complet-2026-10-19.sql : bases Carder, Quizz, SAE_Detection, T_cartographie) ; PG 17 désinstallé (vérifié le 2026-11-20 : PG 18 démarré, Node v24.22.0 par défaut, pgAdmin 9.18). Pas de Docker pour l’instant. Outil graphique : pgAdmin 9.18 (Homebrew) — HeidiSQL écarté pour PostgreSQL (une session par base).
- Un seul dépôt avec deux dossiers : `client/` et `server/`.
- Modèles d'organisation : deux dépôts privés de son employeur, un back en couches (routes/controllers/services/repositories/models/middlewares) et un front par domaine (pages/components/hooks/services/<domaine>). Noms des dépôts : [[prive-entreprise]] (fichier local au Mac, non synchronisé). S'inspirer de la structure seulement, ne pas copier de code (propriété de l'employeur, plugin public). Écarter ce qui est propre à l'entreprise : paquets internes, MSAL/Entra, SQL Server, Azure, semantic-release.
- Node : nvm seul gestionnaire, défaut = LTS (v24.22.0 au 2026-10-19). Node Homebrew conservé car requis par mongosh/mongodb.

**Why:** fondation commune à tous ses projets perso ; les agents front/back/bdd s'appuieront dessus.

- Fabrication (choix C, 2026-10-19) : hybride — nos fichiers (structure en couches, configs, conventions) figés en modèle dans le plugin ; dépendances installées à la création, version majeure bloquée (ex. Express 5.x).
- Outils (validés 2026-10-19) : ESLint + Prettier, Husky + lint-staged (y brancher aussi le hook PROJET.md), Vitest client+serveur (+ Supertest, Testing Library), Zod (partageable client/serveur), helmet + cors + express-rate-limit, `node --env-file` (pas dotenv).
- Authentification : PAS dans le squelette (dépend de chaque projet).
- Migrations (validé 2026-10-19) : sequelize-cli + seeders ; règle agents : jamais `sync()` ; code en ESM (`import`), fichiers de migration/seed en `.cjs` (limite sequelize-cli).
- Commandes (validé 2026-10-19) : deux commandes séparées `/squelette-client` et `/squelette-server` (pas de commande bdd : la préparation PostgreSQL/Sequelize/migrations fait partie de `/squelette-server`). Pas de nom `/init` (conflit avec la commande intégrée).
- BDD (validé 2026-10-19) : le squelette ne touche pas à PostgreSQL ; il prépare seulement le branchement (config Sequelize lue depuis .env, `.env.example`, dossiers `migrations/` et `seeders/` vides). La base vide + les tables = agent `bdd`. Fin de `/squelette-server` : vérifier que le serveur démarre, pas la connexion BDD.
- Fichiers racine (validé 2026-10-19) : chaque commande crée Husky/Prettier/.gitignore s'ils manquent, ne touche à rien sinon. Mono-dépôt → à la racine commune ; dépôts séparés → à la racine de chaque projet.
- Détails validés : React Router, code en anglais + commentaires FR, exemple = route `GET /api/health` seulement. Migrations créées par `npm run db:new -- migration <nom>` (génère du .cjs).

**How to apply:** partir de ces choix sans les reproposer ; squelette écrit et testé ; le modifier dans plugins/ia-kit/templates/.
