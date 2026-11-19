# ---------------------------------------------------------------
#   mp3 : convertit une vidéo ou une playlist YouTube en mp3
#   Usage : mp3 "lien"  (plusieurs liens possibles)
#   - vidéo seule → ~/Music/YouTube/
#   - playlist    → ~/Music/<nom de la playlist>/
# ---------------------------------------------------------------
mp3() {
  if [ $# -eq 0 ]; then
    echo 'Usage : mp3 "lien YouTube" ["autre lien" ...]'
    echo '  vidéo seule → ~/Music/YouTube/'
    echo '  playlist    → ~/Music/<nom de la playlist>/'
    echo '  album       → ~/Music/<nom de l album>/ (album, artiste, numéros et titres remplis)'
    echo '  (mets toujours le lien entre guillemets)'
    return 1
  fi
  local options=(-x --audio-format mp3 --audio-quality 0 --embed-thumbnail --add-metadata)
  # Album YouTube Music (lien OLAK5uy_ ou browse/MPREb_) : les clips ordinaires de l'album n'ont ni album
  # ni numéro, et leur titre est « Artiste - Titre (Official Video) ». On remplit et on nettoie.
  local album=(
    --parse-metadata "playlist_title:%(album)s"
    --parse-metadata "playlist_index:%(track_number)s"
    --parse-metadata "%(track&HAS|)s%(title)s:^(?!HAS)(?P<artist>.+?) - (?P<track>.+)$"
    --replace-in-metadata "track" "\s*[\(\[][^\)\]]*(Official|Officiel|Video|Audio|Lyric|Visuali)[^\)\]]*[\)\]]" ""
    --replace-in-metadata "album" "^Album - " ""
  )
  local lien
  for lien in "$@"; do
    if [[ "$lien" == *"OLAK5uy_"* || "$lien" == *"browse/MPREb_"* ]]; then
      yt-dlp "${options[@]}" "${album[@]}" --yes-playlist \
        -o "$HOME/Music/%(playlist_title)s/%(playlist_index)03d - %(track,title)s.%(ext)s" "$lien" \
        2> >(grep -v -i "could not interpret" >&2)
    # Vraie playlist : le lien contient list=, sauf les "Mix" auto de YouTube (list=RD...), quasi infinis
    elif [[ "$lien" == *"list="* && "$lien" != *"list=RD"* ]]; then
      yt-dlp "${options[@]}" --yes-playlist \
        -o "$HOME/Music/%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s" "$lien"
    else
      yt-dlp "${options[@]}" --no-playlist \
        -o "$HOME/Music/YouTube/%(title)s.%(ext)s" "$lien"
    fi
  done
}
