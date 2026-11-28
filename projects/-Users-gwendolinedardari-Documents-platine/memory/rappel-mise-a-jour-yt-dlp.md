---
name: rappel-mise-a-jour-yt-dlp
description: Platine importe depuis YouTube avec yt-dlp : rappeler à l'utilisatrice de le mettre à jour (commande du serveur dans NOTES-SERVEUR.md, brew upgrade yt-dlp sur le Mac)
metadata:
  type: project
---

Depuis le 2026-11-13, Platine a un import YouTube réservé à l'admin (yt-dlp + ffmpeg sur la machine qui fait tourner le serveur). L'utilisatrice a demandé explicitement : « si à un moment je l'ai plus, que tu me le dises » — garder en tête la mise à jour de yt-dlp pour qu'on ne l'oublie pas.

**Why:** yt-dlp casse dès que YouTube change ; une version de plus d'un mois finit souvent bloquée.

**How to apply:** quand elle travaille sur Platine ou sur le serveur maison ([[notes-serveur-maison]]), et surtout si elle signale une erreur d'import YouTube (« YouTube bloque le serveur », « YouTube a refusé la demande »), lui rappeler : sur le serveur, la commande notée dans NOTES-SERVEUR.md (section « Platine sur le serveur » ; depuis le 2026-11-26, Platine est sous Docker dans la VM prod : `ssh prod` puis `cd /opt/platine && docker compose exec api yt-dlp -U`, vérifié dans compose.yaml et server/Dockerfile) ; Mac `brew upgrade yt-dlp`. Vérifier d'abord la version (c'est une date). L'appli affiche aussi une alerte dans l'onglet YouTube quand la version a plus de 30 jours.
