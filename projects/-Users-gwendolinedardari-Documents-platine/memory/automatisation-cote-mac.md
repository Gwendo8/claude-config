---
name: automatisation-cote-mac
description: "Déploiement de Platine sur le serveur maison : ce sera des workflows GitHub Actions (prévus en fin de projet), ni script sur le serveur, ni skill côté Mac"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c7917358-3d49-4be7-baa8-b3cc1d5a2b2b
  modified: 2026-11-16T09:53:16.060Z
---

Le 2026-11-11, l'utilisatrice a refusé un script `maj` à installer sur le serveur maison (« je veux pas de ce genre de chose sur le serveur pour le moment »). Le 2026-11-16, elle a aussi refusé un skill `/deployer` lancé depuis le Mac : le déploiement sera fait par des workflows GitHub Actions, déjà prévus dans les notes du serveur ([[notes-serveur-maison]], recette `.github/workflows/deploy.yml` dans le dépôt Platine, à activer en fin de projet).

**Why:** elle veut reproduire ce qu'elle connaît au travail (déploiement automatique au push). Une automatisation intermédiaire (script, skill) serait du travail jeté. Elle s'est étonnée que je propose un skill alors que la décision était notée.

**How to apply:** pour le déploiement de Platine, ne proposer ni script, ni skill, ni commande : donner la ligne manuelle de « Platine sur le serveur » dans les notes, et rappeler que les workflows viendront en fin de projet. Avant de proposer une automatisation autour du serveur, relire les notes du serveur : si la décision y est déjà, la suivre.
