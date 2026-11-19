---
name: rappel-mise-a-jour-yt-dlp
description: Platine importe depuis YouTube avec yt-dlp : rappeler à l'utilisatrice de le mettre à jour (sudo yt-dlp -U sur le serveur, brew upgrade yt-dlp sur le Mac)
metadata:
  type: project
---

Depuis le 2026-11-13, Platine a un import YouTube réservé à l'admin (yt-dlp + ffmpeg sur la machine qui fait tourner le serveur). L'utilisatrice a demandé explicitement : « si à un moment je l'ai plus, que tu me le dises » — garder en tête la mise à jour de yt-dlp pour qu'on ne l'oublie pas.

**Why:** yt-dlp casse dès que YouTube change ; une version de plus d'un mois finit souvent bloquée.

**How to apply:** quand elle travaille sur Platine ou sur le serveur maison ([[notes-serveur-maison]]), et surtout si elle signale une erreur d'import YouTube (« YouTube bloque le serveur », « YouTube a refusé la demande »), lui rappeler : serveur `sudo yt-dlp -U` puis rien d'autre ; Mac `brew upgrade yt-dlp`. Vérifier d'abord la version avec `yt-dlp --version` (c'est une date). Installation sur le serveur pas encore faite au 2026-11-13 (commandes dans NOTES-SERVEUR.md, section « Import YouTube »). L'appli affiche aussi une alerte dans l'onglet YouTube quand la version a plus de 30 jours.
