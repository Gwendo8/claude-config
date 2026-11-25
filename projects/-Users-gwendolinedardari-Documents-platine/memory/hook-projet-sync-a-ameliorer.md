---
name: hook-projet-sync-a-ameliorer
description: hook projet-sync d'ia-kit à régler pour ne signaler que les fichiers modifiés par la conversation en cours — accord de Gwendoline, à faire après Proxmox
metadata:
  type: project
---

Le hook de fin `projet-sync.sh` (plugin ia-kit, `~/Documents/ia/plugins/ia-kit/templates/commun/.husky/projet-sync.sh`) signale tous les fichiers modifiés du dépôt, même ceux d'une autre conversation : il s'est déclenché à chaque réponse d'une conversation Proxmox qui n'avait pas touché au code (2026-11-25).

Source : accord de Gwendoline le 2026-11-25 pour le régler afin qu'il ne vise que les fichiers modifiés par la conversation en cours.

**Why:** il consomme du quota et pousse à documenter des changements dont on ignore l'origine.
**How to apply:** le proposer après la première partie de Proxmox (voir [[notes-serveur-maison]]) ; changement dans le dépôt ia (Gwendo8/ia).
