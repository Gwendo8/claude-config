# claude-config

**[Voir la carte de ma config](https://gwendo8.github.io/claude-config/carte.html)** : règles, outils, mémoire et gardiens, en un coup d'œil. Elle est refaite toute seule à chaque synchro.

Sauvegarde privée de ma mémoire Claude Code et de mes petits outils. Le dossier `~/.claude` lui-même est ce dépôt, mais seuls quelques fichiers sont envoyés (liste dans `.gitignore`) : jamais les conversations, le cache ou les plugins téléchargés.

| Fichier | Contenu |
| --- | --- |
| `CLAUDE.md` | Mes règles pour tous les projets, dont « Erreurs à ne pas refaire » |
| `erreurs.md` | Journal des erreurs vues une fois (skill `erreurs` d'ia-kit) |
| `settings.json` | Mes réglages Claude Code : plugins activés, hooks de synchro, attribution des commits… |
| `menage-memoire.json` | Date du dernier `/menage-memoire` |
| `projects/*/memory/` | Mémoire automatique de chaque projet (sauf les fichiers `prive-*.md`, gardés sur le Mac) |
| `sync/synchro.sh` | Script de synchronisation, avec son garde-fou |
| `sync/carte.mjs` | Génère `carte.html`, la carte de ce dépôt (lancé par `synchro.sh`) |
| `carte.html` | La carte, publiée par GitHub Pages (`.nojekyll` : fichiers servis tels quels) |
| `outils/mp3.zsh` | Ma commande terminal `mp3 "lien"` (YouTube → mp3) |

Jamais de mot de passe, de jeton ni d'info confidentielle d'entreprise dans ces fichiers.

## Synchronisation automatique

Deux hooks de `settings.json` lancent `sync/synchro.sh` :

- **ouverture d'une conversation** : envoie ce qui attend, puis récupère la dernière version ;
- **fermeture d'une conversation** : enregistre et envoie les changements.

En cas d'échec (pas de réseau, modifications faites sur deux ordinateurs en même temps), rien n'est perdu et Claude le signale au début de la conversation suivante.

**Garde-fou** : le dépôt est public. Avant chaque enregistrement, `synchro.sh` cherche dans les fichiers à envoyer les mots de `sync/mots-interdits.txt` (nom de l'employeur, adresses IP…). S'il en trouve un, rien n'est enregistré ni envoyé, et Claude montre le passage en cause à la conversation suivante. Cette liste reste sur le Mac (elle contient justement les mots à ne pas publier).

`settings.json` ne doit contenir que des réglages valables sur toutes les machines : il est partagé. Ce qui dépend d'une machine (où se trouve le dépôt `ia`, par exemple) est enregistré par Claude Code dans `~/.claude/plugins/`, qui n'est pas synchronisé.

---

# Installer toute ma config sur un nouvel ordinateur

Pour Mac ou Linux. Compter 15 à 20 minutes. À faire dans l'ordre.

> Windows : les scripts des hooks sont écrits pour `sh` et n'ont jamais été testés sous Windows. Passer par WSL (Linux dans Windows) est le plus sûr.

## 1. Installer les programmes de base

| Programme | Pourquoi | Installation |
| --- | --- | --- |
| **Git** | Récupérer les dépôts | Mac : `xcode-select --install` · Linux : `sudo apt install git` |
| **GitHub CLI** (`gh`) | Se connecter à GitHub (dépôts privés) | Mac : `brew install gh` · Linux : voir cli.github.com |
| **Node.js** via **nvm** | Les hooks d'ia-kit et ses serveurs MCP tournent avec Node | Installer nvm (github.com/nvm-sh/nvm), puis `nvm install --lts` |
| **Claude Code** | Évidemment | `curl -fsSL https://claude.ai/install.sh \| bash` |

Puis se connecter à GitHub :

```bash
gh auth login        # choisir GitHub.com, HTTPS, et se connecter avec le navigateur
gh auth setup-git    # pour que git utilise cette connexion (dépôts privés)
```

## 2. Lancer Claude Code une première fois

```bash
claude
```

Se connecter à son compte, puis quitter (`/exit`). Ça crée le dossier `~/.claude`.

## 3. Récupérer cette config dans `~/.claude`

```bash
cd ~/.claude
git init -q
git remote add origin https://github.com/Gwendo8/claude-config.git
git fetch -q origin
git checkout -f -B main origin/main
```

Les fichiers par défaut de la nouvelle machine (`settings.json`…) sont remplacés par les miens. À partir de là, la synchro automatique est active.

Deux fichiers ne sont pas sur GitHub (le dépôt est public). Les recopier depuis le Mac au même endroit, par clé USB ou AirDrop, jamais par GitHub :

- `~/.claude/sync/mots-interdits.txt` : la liste du garde-fou. Sans elle, le garde-fou est inactif et Claude le signale à chaque conversation.
- `~/.claude/projects/-Users-gwendolinedardari-Documents-ia/memory/prive-entreprise.md` : la mémoire des détails liés à mon employeur. Sans lui, tout marche : les autres mémoires en gardent une version sans nom.

## 4. Récupérer le plugin ia-kit

```bash
mkdir -p ~/Documents
git clone https://github.com/Gwendo8/ia.git ~/Documents/ia
claude plugin marketplace add ~/Documents/ia
```

La dernière commande dit à Claude Code où se trouve le plugin **sur cette machine**. `settings.json` l'active déjà (`ia-kit@gwendo8`). Vérifier :

```bash
claude plugin list     # ia-kit@gwendo8 doit être « enabled »
```

Si je développe le plugin sur cette machine, activer aussi ses hooks git :

```bash
cd ~/Documents/ia && git config core.hooksPath .githooks
```

## 5. Installer les compléments utilisés par les agents

```bash
claude plugin marketplace add anthropics/claude-code
claude plugin install frontend-design@claude-code-plugins
claude plugin marketplace add pbakaus/impeccable
claude plugin install impeccable@impeccable
mkdir -p ~/.claude/skills/web-design-guidelines && curl -fsSL https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/web-design-guidelines/SKILL.md -o ~/.claude/skills/web-design-guidelines/SKILL.md
```

(Même liste que la section « Compléments à installer » du README d'ia.)

## 6. La commande `mp3`

Installer ses deux outils : Mac `brew install yt-dlp ffmpeg` · Linux `sudo apt install ffmpeg` puis `pipx install yt-dlp` (la version d'apt est souvent trop vieille pour YouTube).

Puis ajouter à la fin de `~/.zshrc` (si le terminal est en zsh ; sinon installer zsh, la fonction en utilise la syntaxe) :

```bash
# mp3 : convertit une vidéo ou une playlist YouTube en mp3 (usage : mp3 "lien").
[ -f "$HOME/.claude/outils/mp3.zsh" ] && source "$HOME/.claude/outils/mp3.zsh"
```

Ouvrir un nouveau terminal et taper `mp3` : l'aide doit s'afficher.

## 7. Selon les projets (facultatif)

- **Bases de données** (agent `bdd`, MCP pgadmin) : PostgreSQL et pgAdmin. Les mots de passe vont dans `~/.pgpass`, jamais dans ces dépôts.
- **Mes projets** : `git clone` de chacun. Pour que Claude retrouve leur mémoire, les ranger au **même chemin** que sur le Mac (`~/Documents/platine`…) ; le dossier de mémoire porte le chemin complet (`projects/-Users-gwendolinedardari-Documents-platine/`), donc avec un autre nom d'utilisateur, renommer ce dossier en remplaçant `-Users-gwendolinedardari` par le nouveau chemin (ex. `-home-gwen`).
- **Accès au serveur `maison`** : recopier le bloc `Host maison` de `~/.ssh/config` et la clé SSH (jamais via GitHub), et installer Tailscale si le serveur passe par lui.

## 8. Vérifier que tout marche

Ouvrir une conversation dans un projet et demander « que dit ma mémoire ? » : Claude doit connaître mes règles (français, sections séparées par des traits…). Écrire « tu as encore oublié » : le hook de repérage des erreurs doit se manifester.
