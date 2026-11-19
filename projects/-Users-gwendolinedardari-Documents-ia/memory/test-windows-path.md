---
name: test-windows-path
description: "À tester sur le PC Windows — lanceurs node.sh / .husky/path.sh (node, npx, claude.exe) jamais essayés sous Windows"
metadata:
  node_type: memory
  type: project
  originSessionId: 12648960-4e06-4c80-af9d-93e456f0e867
  modified: 2026-11-18T08:15:06.552Z
---

Le 2026-11-18, on a ajouté `plugins/ia-kit/hooks/node.sh` et `templates/commun/.husky/path.sh` (copié dans Platine) pour retrouver node, npx et claude quand le PATH est réduit (VS Code ouvert depuis le Dock sur Mac). L'utilisatrice utilise aussi Windows, mais aucun PC n'était sous la main : rien n'a été testé sous Windows.

**Why:** sous Windows, tout repose sur des suppositions (sh fourni par Git Bash, PATH système transmis aux applis, nom `claude.exe`).

**How to apply:** quand elle mentionne son PC Windows, lui rappeler le test, dans Git Bash à la racine de Platine : `sh -c '. .husky/path.sh; command -v node npx claude'`, puis un vrai commit. Corriger à partir de ce qui s'affiche. Voir [[plugin-charge-depuis-depot]].
