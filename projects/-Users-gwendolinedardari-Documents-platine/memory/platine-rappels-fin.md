---
name: platine-rappels-fin
description: "Rappels à faire à l'utilisatrice une fois le front (et l'équipe) terminés sur Platine : renommage du dossier, compte admin, clés"
metadata:
  node_type: memory
  type: project
  originSessionId: 9def5242-19a7-4665-bd44-86de39d4cc1f
  modified: 2026-10-22T13:04:51.955Z
---

Sur le projet Platine (dossier `projet-spotify`, dépôt GitHub privé Gwendo8/Platine), l'utilisatrice a reporté au moment où le front / l'équipe aura fini (décision du 2026-10-22) :

1. **Renommer le dossier** `projet-spotify` → `platine` (elle ferme VS Code, renomme dans le Finder, rouvre dans `platine`). Avant : copier ce dossier mémoire vers le chemin correspondant au nouveau dossier.
2. **Créer son compte super admin** : `cd server && npm run admin:create` (à lancer elle-même, mot de passe privé).
3. **Clé Jamendo** (`JAMENDO_CLIENT_ID` dans `server/.env`) puis essai réel de la musique libre par l'agent back.
4. **Compte Brevo perso** (`BREVO_API_KEY`, `MAIL_FROM_EMAIL`) — pas le connecteur Brevo de son compte entreprise.
5. **Avis sur le réglage des couleurs de pochette** (serveur : 10:1 / 88 % de blanc, `server/src/utils/coverColors.js`), puis mettre `DESIGN.md` §2.1 en cohérence.

**Au déploiement** : coder le stockage Cloudflare R2 (AUDIT.md I-3, agent back), plus S-1 (exiger APP_URL et CORS_ORIGIN en prod) et S-2 (en-têtes de sécurité chez l’hébergeur du front). Tests iPhone réels (liste dans PROJET.md) seulement après déploiement en HTTPS.

**Plus tard (demandé par l’utilisatrice le 2026-10-23)** : passer la déconnexion en « appareil par appareil » (option B de AUDIT.md M-4 : table `sessions`, un identifiant par appareil, seule la session de l’appareil qui se déconnecte est supprimée). Pour l’instant, option A en place (version de session : se déconnecter ferme la session sur tous les appareils).

**À reparler dans une autre conversation** (demande de l’utilisatrice) : lancer `npm run test:e2e` automatiquement avant chaque `git push` (hook pre-push, ~35 s), idée réutilisable dans ia-kit. Lui expliquer d’abord à quoi servent les tests de bout en bout.

**Why:** elle veut d'abord voir le front fini, et le renommage interromprait la session en cours.

**How to apply:** rappeler ces points dans le récapitulatif de fin d'équipe (étape « Livrer » de /chef). Le déploiement (R2, hébergement) est aussi pour plus tard. Voir [[commits-par-etape]].
