#!/bin/sh
# Synchronise ~/.claude avec le dépôt GitHub privé Gwendo8/claude-config.
# Seuls les fichiers autorisés par ~/.claude/.gitignore partent : CLAUDE.md global, journal des erreurs,
# réglages, mémoire des projets, ce dossier sync/.
#
#   sh synchro.sh debut  → hook SessionStart : envoie ce qui attend, récupère la dernière version.
#                          En cas de souci, prévient Claude, qui le dit à l'utilisatrice.
#   Avant chaque enregistrement, un garde-fou bloque tout s'il trouve un mot interdit (voir verifier).
#
#   sh synchro.sh fin    → hook SessionEnd : enregistre et envoie les changements de la conversation.
#                          Claude ne peut plus parler à ce moment-là : un échec est noté dans
#                          sync/derniere-erreur.txt (non versionné) et signalé à la conversation suivante.
#
# Ne bloque jamais Claude : sort toujours avec le code 0.

DOSSIER="$HOME/.claude"
ERREUR="$DOSSIER/sync/derniere-erreur.txt"
cd "$DOSSIER" 2>/dev/null && git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Garde-fou : le dépôt est public. Avant tout commit, cherche les mots interdits (liste locale
# sync/mots-interdits.txt, non synchronisée) dans les fichiers prêts à partir. S'il en trouve, rien
# n'est enregistré ni envoyé : BLOQUE contient alors les fichiers en cause.
BLOQUE=""
verifier() {
  LISTE="$DOSSIER/sync/mots-interdits.txt"
  [ -f "$LISTE" ] || { SANS_LISTE=1; return 0; }
  MOTIFS=$(mktemp)
  grep -v -e '^#' -e '^[[:space:]]*$' "$LISTE" > "$MOTIFS"
  [ -s "$MOTIFS" ] && BLOQUE=$(git grep --cached -l -i -E -f "$MOTIFS" 2>/dev/null | tr '\n' ' ')
  rm -f "$MOTIFS"
}

# Carte du dépôt (carte.html, en ligne via GitHub Pages) : refaite avant chaque enregistrement.
# Node peut manquer dans le PATH d'un hook (installé par nvm) : on le cherche aussi dans ~/.nvm.
carte() {
  NODE=$(command -v node || ls -d "$HOME"/.nvm/versions/node/*/bin/node 2>/dev/null | tail -1)
  [ -n "$NODE" ] && "$NODE" "$DOSSIER/sync/carte.mjs" >/dev/null 2>&1
}

enregistrer() {
  carte
  git add -A >/dev/null 2>&1
  verifier
  if [ -n "$BLOQUE" ]; then
    git reset -q >/dev/null 2>&1
    return 1
  fi
  git diff --cached --quiet || git commit -q -m "Synchro le $(date '+%Y-%m-%d %H:%M')" >/dev/null 2>&1
}

prevenir() {
  MESSAGE="Synchro de la mémoire (dépôt claude-config) : $1 Dis-le à l'utilisatrice en une phrase au début de ta première réponse, avec la cause probable si tu la vois, sans rien réparer sans son accord."
  printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}' "$(printf '%s' "$MESSAGE" | sed 's/\\/\\\\/g; s/"/\\"/g')"
}

case "$1" in
  debut)
    PRECEDENTE=""
    [ -f "$ERREUR" ] && PRECEDENTE="La dernière synchro de fin de conversation a échoué ($(cat "$ERREUR")). " && rm -f "$ERREUR"
    if ! enregistrer; then
      prevenir "${PRECEDENTE}Envoi bloqué par le garde-fou : un mot interdit (liste dans sync/mots-interdits.txt) apparaît dans : ${BLOQUE}. Rien n'est parti sur GitHub (dépôt public). Montre à l'utilisatrice le passage en cause et propose de le reformuler."
      exit 0
    fi
    [ -n "$SANS_LISTE" ] && PRECEDENTE="${PRECEDENTE}Garde-fou inactif : le fichier sync/mots-interdits.txt manque sur cet ordinateur (à recopier depuis le Mac, voir le README). "
    if ! git pull -q --rebase --autostash >/dev/null 2>&1; then
      git rebase --abort >/dev/null 2>&1
      prevenir "${PRECEDENTE}La récupération depuis GitHub a échoué (pas de réseau, ou modifications faites des deux côtés en même temps). Rien n'est perdu : les fichiers locaux sont intacts."
      exit 0
    fi
    git push -q >/dev/null 2>&1 || PRECEDENTE="${PRECEDENTE}L'envoi vers GitHub a échoué (réseau ?). "
    [ -n "$PRECEDENTE" ] && prevenir "$PRECEDENTE"
    ;;
  fin)
    if ! enregistrer; then
      echo "envoi bloqué par le garde-fou le $(date '+%Y-%m-%d à %H:%M') : mot interdit dans ${BLOQUE}" > "$ERREUR"
      exit 0
    fi
    git push -q >/dev/null 2>&1 || date '+envoi impossible le %Y-%m-%d à %H:%M' > "$ERREUR"
    ;;
esac
exit 0
