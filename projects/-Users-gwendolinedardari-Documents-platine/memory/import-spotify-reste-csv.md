---
name: import-spotify-reste-csv
description: "Platine, import Spotify : on garde le CSV Exportify, pas de bouton « Connecter Spotify » (API officielle écartée)"
metadata:
  node_type: memory
  type: project
  originSessionId: 043854de-5389-4849-8d0e-4ee30dcd3e2b
  modified: 2026-11-28T08:54:38.248Z
---

L'import Spotify de Platine reste par fichier CSV Exportify. Le bouton « Connecter Spotify » (API officielle) est écarté.

**Why:** l'utilisatrice n'a pas d'abonnement Spotify Premium. Depuis février 2026, une appli Spotify en mode développement exige que son propriétaire ait Premium et accepte 5 utilisateurs au maximum. Le CSV n'a pas de limite d'utilisateurs. Source : confirmé par l'utilisatrice le 2026-11-28. Règles Spotify vérifiées le même jour dans leur guide de migration de février 2026.

**How to apply:** ne pas reproposer l'API Spotify ni la lecture d'un lien de playlist, sauf si sa situation change (Premium, ou plus besoin de plus de 5 personnes). Pour simplifier l'import, améliorer le parcours CSV.
