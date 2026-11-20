---
name: ia-kit-plugin
description: "Le projet ia est le plugin Claude Code \"ia-kit\" (marketplace gwendo8), dépôt GitHub public Gwendo8/ia"
metadata:
  node_type: memory
  type: project
  originSessionId: 6431bf11-d6a4-4696-97bb-c53011831899
  modified: 2026-10-21T11:35:43.149Z
---

Le dossier ia contient le plugin Claude Code `ia-kit` dans le marketplace `gwendo8`, sur le dépôt GitHub Gwendo8/ia. Le dépôt, créé en privé le 2026-10-19, est **public** depuis que l'utilisatrice l'a basculé (confirmé voulu le 2026-11-18). Toutes les explications avec l'utilisatrice se font en français.

**Why:** Au départ elle voulait un dépôt privé avec une vitrine à part ; elle a ensuite choisi de rendre tout le dépôt public.

**How to apply:** Tout ce qui est poussé est visible de tous : ne jamais y mettre de secret ni de donnée personnelle ou d'entreprise. GitHub Pages est activé (branche main, `.nojekyll`) : la carte du plugin est en ligne sur https://gwendo8.github.io/ia/carte.html, régénérée par `.githooks/carte.mjs` au pre-commit. Le nom a été choisi pour être parlant (« ia-kit ») plutôt que personnel.

## Points encore ouverts (vérifié le 2026-11-20)
- **CI GitHub Actions** dans le squelette : pas encore faite. Prévue après des tests sur de vrais projets (il faut une base PostgreSQL de test dans GitHub).
- **Numéro de version** toujours `0.1.0` : sur ce Mac c'est sans effet (plugin lu depuis le dépôt, voir [[plugin-charge-depuis-depot]]), mais sur un poste qui installe depuis GitHub, `claude plugin update` risque de ne rien voir de neuf. Envisager d'incrémenter la version à chaque push.

L'historique de construction (agents, hooks, décisions d'octobre) est dans `git log` et le README du dépôt : partir de là plutôt que de la mémoire.
