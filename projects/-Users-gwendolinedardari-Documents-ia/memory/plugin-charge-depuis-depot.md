---
name: plugin-charge-depuis-depot
description: "ia-kit est installé pour l'utilisateur (tous les projets) et lu directement depuis le dépôt local ; le dossier cache est un vestige"
metadata:
  node_type: memory
  type: project
  originSessionId: dfa92f45-b3a8-483a-9dbe-169a5d34492e
  modified: 2026-11-10T21:39:05.325Z
---

ia-kit est installé en portée « user », donc actif dans tous ses projets, et sa source est le dossier local ~/Documents/ia (marketplace « directory » enregistrée par `claude plugin marketplace add ~/Documents/ia` dans ~/.claude/plugins/known_marketplaces.json, propre à chaque machine ; retirée de settings.json le 2026-11-19 car ce fichier est synchronisé entre machines via claude-config). Claude Code lit donc directement les fichiers du dépôt. Le dossier ~/.claude/plugins/cache/gwendo8/ia-kit/0.1.0 date du 20/10/2026 et ne sert plus. Le numéro de version ne compte pas en local.

**Why:** le 10/11/2026, j'ai pris ce cache pour la version utilisée et j'ai annoncé à tort que le plugin n'était pas à jour, ce qui lui a fait perdre 30 minutes.

**How to apply:** pour savoir si le plugin est à jour, regarder le dépôt et non le cache ; une modification est prise en compte au redémarrage de Claude Code. Voir [[ia-kit-plugin]].
