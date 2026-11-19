---
name: commits-par-etape
description: "L'utilisatrice veut un commit à chaque étape validée et à chaque fonctionnalité, faits par Claude (chef), jamais de push sans demande"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 9def5242-19a7-4665-bd44-86de39d4cc1f
  modified: 2026-10-22T11:45:33.805Z
---

Faire un commit à la fin de chaque étape validée (init, bdd, design…) et à chaque fonctionnalité terminée côté back/front, sans attendre de tout livrer d'un coup. C'est Claude (en rôle chef) qui commite, après avoir vérifié lint/tests ; les agents spécialistes ne commitent pas. Jamais de push ni de dépôt distant sans demande explicite.

**Why:** le 2026-10-22 sur Platine, elle a découvert qu'aucun commit n'avait été fait depuis le début et a demandé à garder une trace étape par étape ; elle a validé que Claude fasse les commits et que la règle soit ajoutée à la commande `/chef` d'ia-kit.

**How to apply:** signaler chaque commit en une ligne (message + contenu). Ne pas commiter le travail d'un agent encore en cours. Voir aussi [[ia-kit-chef-commits]].
