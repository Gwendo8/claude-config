---
name: montrer-les-alternatives
description: "Aux choix d'architecture, nommer les alternatives sérieuses (même plus avancées) et laisser l'utilisatrice choisir, au lieu de trancher seul pour « faire simple »"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c7917358-3d49-4be7-baa8-b3cc1d5a2b2b
  modified: 2026-11-12T13:33:17.997Z
---

Le 2026-11-12, après que des collègues lui ont conseillé Proxmox, Docker, Traefik, Cloudflare et un NAS pour son serveur maison ([[notes-serveur-maison]]), l'utilisatrice m'a demandé : « si tu trouves ça utile, pourquoi tu ne me l'as pas proposé ? ». J'avais choisi seul la voie la plus simple (Ubuntu direct, installation à la main, Caddy) sans lui dire que d'autres voies existaient, alors qu'elle avait annoncé dès le début que plusieurs applications viendraient.

**Why:** elle est débutante mais veut décider en connaissance de cause ; découvrir les options par des collègues après coup lui donne l'impression qu'on lui a caché quelque chose. Interprétation de ma part : elle ne reproche pas le choix simple, elle reproche de ne pas avoir vu le choix.

**How to apply:** à chaque embranchement d'architecture ou d'outil, dire en une ou deux phrases quelle est l'alternative plus avancée, ce qu'elle apporte et ce qu'elle coûte, donner ma recommandation, et la laisser trancher. Surtout quand elle a exprimé une ambition (plusieurs projets, environnements dev/staging/prod) qui rend l'alternative pertinente.
