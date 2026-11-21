---
name: calculs-justes-avant-confort
description: "Mijote — un résultat juste passe avant le confort : demander une saisie plutôt que deviner une valeur qui fausse les calories"
metadata:
  node_type: memory
  type: feedback
  originSessionId: eb52411f-dfe9-4b67-9311-76e55abc5cea
  modified: 2026-11-21T22:16:32.666Z
---

Dans Mijote, réduire au maximum ce que l'utilisatrice doit saisir (conversions automatiques), mais jamais au prix d'un résultat faux : quand l'appli n'est pas sûre, elle demande (case vide, message), une étape de plus est acceptable.

**Why:** confirmé par l'utilisatrice le 2026-11-21 (« tant que c'est pas des choses qui faussent les résultats ça me va, au pire ça ajoute une étape »), après le choix de laisser vide la case des grammes quand « Relier » ne peut pas calculer (refus d'un poids retenu ou deviné, ex. boîte de thon 140 g vs 200 g).

**How to apply:** pour toute valeur par défaut, estimation ou valeur mémorisée qui entre dans un calcul de calories, se demander si elle peut fausser le résultat sans qu'on le voie ; si oui, demander la valeur à l'utilisatrice ou la signaler clairement. Voir [[meme-logique-que-platine]] pour les autres règles d'appli.
