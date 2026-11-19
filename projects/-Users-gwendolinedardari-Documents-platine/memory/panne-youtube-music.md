---
name: panne-youtube-music
description: "Platine — que faire quand la recherche « Musique » (YouTube Music, bibliothèque youtubei.js) affiche « YouTube Music ne répond pas »"
metadata:
  node_type: memory
  type: project
  originSessionId: 16d52cdb-13a9-4c6f-9ce8-17d2f6e16587
  modified: 2026-11-19T12:06:16.316Z
---

Depuis le 2026-11-19, la recherche de « Ajouter de la musique » passe par YouTube Music avec la bibliothèque non officielle **youtubei.js** (`server/src/integrations/youtubeMusic.client.js`). Quand YouTube change son site, elle peut casser : l'écran affiche « YouTube Music ne répond pas pour le moment : cherche dans « Vidéos » en attendant » (erreur 502). « Vidéos » (yt-dlp) reste utilisable pendant ce temps.

Réparation, à proposer directement à l'utilisatrice :
1. Sur le Mac : `cd ~/Documents/platine/server && npm i youtubei.js@latest --save-exact`, puis tester une vraie recherche (`searchSongs`) et `npm test`.
2. Commit (package.json + package-lock.json), elle fait `git push`.
3. Sur le serveur : la ligne de mise à jour habituelle de [[notes-serveur-maison]] (git pull, npm ci, build, restart).

**Why:** ne jamais lancer `npm i` directement sur le serveur : ça modifie package.json là-bas et bloque le prochain `git pull` (erreur de conseil faite puis corrigée le 2026-11-19).

**How to apply:** si la recherche « Musique » est en panne alors que « Vidéos » marche, c'est youtubei.js. Si les deux sont en panne, voir plutôt yt-dlp ([[rappel-mise-a-jour-yt-dlp]]) ou le réseau du serveur.
