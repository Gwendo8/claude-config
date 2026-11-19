---
name: prefere-commandes
description: Préfère les commandes (lancées volontairement) aux skills (qui peuvent se déclencher seules)
metadata:
  node_type: memory
  type: feedback
  originSessionId: 16f6f5fa-3c58-434f-9351-1632f5aab628
  modified: 2026-11-13T09:35:24.706Z
---

Pour un nouveau raccourci réutilisable, proposer une **commande** (`commands/*.md`) plutôt qu'une skill.

**Why:** une skill peut être déclenchée automatiquement par Claude à partir d'un mot-clé ; l'utilisatrice veut garder le contrôle sur le lancement.

**How to apply:** créer des commandes dans ia-kit par défaut ; si une skill est vraiment nécessaire, mentionner l'option `disable-model-invocation: true`. Exception validée le 2026-11-13 : quand le but est justement que ça se déclenche sans y penser (skill `erreurs`, réveillé par un hook), elle préfère hook + skill à une commande qu'elle oublierait de taper. Voir [[ia-kit-plugin]].
