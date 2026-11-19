---
name: mcp-pgadmin-avant-prod
description: Avant de brancher un serveur dev/staging/prod au MCP pgadmin — compte PostgreSQL lecture seule + masquage des colonnes sensibles
metadata:
  node_type: memory
  type: project
  originSessionId: 385b3cf5-ba2f-4941-850b-bcc6c43a0eb9
  modified: 2026-10-20T09:50:01.215Z
---

Décidé le 2026-10-20 : le MCP pgadmin d'ia-kit (plugins/ia-kit/mcp/pgadmin) suffit pour le local, mais avant d'y brancher un serveur distant (dev, staging, prod) il faut :
- un **compte PostgreSQL dédié en lecture seule** pour ce serveur (la vraie garantie ; la liste de mots interdits de securite.js n'est qu'un garde-fou, et en local son compte est superutilisateur) ;
- un **masquage** des colonnes sensibles dans les résultats de `requete` (password, email, token… remplacés par `***`), pour ne pas envoyer les données de vrais utilisateurs à Claude.
- probablement aussi gérer le SSL (paramètres de connexion pgAdmin), non traité pour l'instant.

**Why:** elle prévoit d'ajouter des serveurs dev/staging/prod dans pgAdmin ; règle [[bdd-lecture-seule]].
**How to apply:** dès qu'elle parle d'ajouter un serveur distant ou la prod, rappeler ces points avant de l'utiliser.
