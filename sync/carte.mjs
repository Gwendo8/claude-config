// Génère carte.html : la carte mentale de claude-config (règles, outils, mémoire, gardiens).
// Tout est lu dans les fichiers synchronisés (jamais dans les fichiers privés ignorés par git) :
// une règle, une mémoire ou un hook ajouté apparaît tout seul à la synchro suivante.
// Lancé par sync/synchro.sh avant chaque enregistrement, depuis ~/.claude.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

// Fichiers suivis ou nouveaux, sans les fichiers ignorés (prive-*.md, mots-interdits.txt…).
const fichiers = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' })
  .split('\n').filter(Boolean);
const lire = (f) => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };

const phrases = (s) => (s ?? '').split(/(?<=[.!?])\s+/).filter(Boolean);
const sansParentheses = (s) => s.replace(/\s*\([^)]*\)/g, '').trim();
const majuscule = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const sansMarkdown = (s) => s.replace(/\*\*|`/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
const echappe = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const raccourci = (s, max = 120) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max)) + '…');

// --- Mes règles : une entrée par partie « ## » de CLAUDE.md, plus le journal des erreurs ---------------
const regles = [];
const claude = lire('CLAUDE.md');
for (const bloc of claude.split(/^## /m).slice(1)) {
  const [titre, ...lignes] = bloc.split('\n');
  const puces = lignes.filter((l) => /^- /.test(l)).map((l) => sansMarkdown(l.slice(2)));
  if (!puces.length) continue;
  regles.push({
    titre: sansParentheses(titre),
    court: raccourci(sansParentheses(phrases(puces[0])[0] ?? '')),
    detail: puces.map((p) => raccourci(phrases(p)[0] ?? p, 160)),
    tags: ['CLAUDE.md', `${puces.length} règle${puces.length > 1 ? 's' : ''}`],
  });
}
const erreurs = lire('erreurs.md').split('\n').filter((l) => /^- \d{4}-/.test(l)).length;
regles.push({
  titre: 'Journal des erreurs',
  court: 'Les erreurs de Claude vues une fois. Si une erreur revient, elle devient une règle.',
  detail: [`${erreurs} erreur${erreurs > 1 ? 's' : ''} notée${erreurs > 1 ? 's' : ''} pour l'instant.`, 'Rempli par le skill erreurs du plugin ia-kit.'],
  tags: ['erreurs.md'],
});

// --- Outils : commandes du terminal et plugins activés -------------------------------------------
const outils = [];
for (const f of fichiers.filter((f) => /^outils\/[^/]+\.(zsh|sh)$/.test(f))) {
  const m = lire(f).match(/^#\s+(\w[\w-]*)\s*:\s*(.+)$/m);
  const usage = lire(f).match(/^#\s+Usage\s*:\s*(.+)$/m);
  outils.push({
    titre: m ? m[1] : f.split('/').pop(),
    court: m ? majuscule(m[2].trim()) + '.' : 'Commande du terminal.',
    detail: usage ? [`À taper : ${usage[1].trim()}`] : [],
    tags: ['commande du terminal', f],
  });
}
const reglages = JSON.parse(lire('settings.json') || '{}');
const dejaVus = new Set();
for (const [nom, actif] of Object.entries(reglages.enabledPlugins ?? {})) {
  if (!actif) continue;
  const [plugin, source] = nom.split('@');
  if (dejaVus.has(plugin)) continue;
  dejaVus.add(plugin);
  outils.push({
    titre: `Plugin ${plugin}`,
    court: plugin === 'ia-kit' ? 'Mon plugin : chef de projet, agents spécialistes et leurs outils.' : 'Plugin activé dans Claude Code.',
    detail: [`Source : ${source}.`],
    tags: ['plugin', 'settings.json'],
  });
}

// --- Mémoire : une entrée par projet, avec ses mémoires (lues dans son MEMORY.md) -----------------
const memoire = [];
const projets = [...new Set(fichiers.map((f) => f.match(/^projects\/([^/]+)\/memory\//)?.[1]).filter(Boolean))];
for (const p of projets.sort()) {
  const nom = p.replace(/^.*-Documents-/, '').replace(/^-/, '') || p;
  const souvenirs = fichiers.filter((f) => f.startsWith(`projects/${p}/memory/`) && !f.endsWith('/MEMORY.md'));
  const index = lire(`projects/${p}/memory/MEMORY.md`).split('\n')
    .map((l) => l.match(/^- \[([^\]]+)\]\(([^)]+)\)/))
    .filter((m) => m && souvenirs.includes(`projects/${p}/memory/${m[2]}`))
    .map((m) => m[1]);
  memoire.push({
    titre: `Projet ${nom}`,
    court: `${souvenirs.length} souvenir${souvenirs.length > 1 ? 's' : ''} que Claude relit à chaque conversation dans ce projet.`,
    detail: index,
    tags: ['mémoire', `projects/…${nom}/memory/`],
  });
}

// --- Gardiens : hooks de settings.json et garde-fou de la synchro ---------------------------------
const MOMENTS = {
  SessionStart: 'Au début de chaque conversation',
  SessionEnd: 'À la fin de chaque conversation',
  UserPromptSubmit: 'À chaque message que tu envoies',
  PreToolUse: 'Avant chaque outil utilisé par Claude',
  PostToolUse: 'Après chaque outil utilisé par Claude',
  Stop: 'À la fin de chaque réponse',
};
// Script à plusieurs modes : texte de la ligne « #   sh synchro.sh mode → ce qu'il fait ».
function descriptionMode(texte, mode) {
  const lignes = texte.split('\n');
  const i = lignes.findIndex((l) => new RegExp(`^#.*\\s${mode}\\s+→`).test(l));
  if (i < 0) return '';
  let bloc = lignes[i].split('→').pop();
  for (const l of lignes.slice(i + 1)) {
    if (!/^#\s{10,}\S/.test(l)) break;
    bloc += ' ' + l.replace(/^#\s+/, '');
  }
  return majuscule(sansParentheses(phrases(bloc.replace(/^[^:]*:\s*/, '').trim())[0] ?? ''));
}
const gardiens = [];
for (const [evenement, groupes] of Object.entries(reglages.hooks ?? {})) {
  for (const g of groupes) {
    for (const h of g.hooks ?? []) {
      const m = (h.command ?? '').match(/\.claude\/([^"\s]+\.(?:sh|mjs|js))"?\s*(\w+)?/);
      const chemin = m?.[1] ?? '';
      gardiens.push({
        titre: MOMENTS[evenement] ?? evenement,
        court: (m?.[2] && descriptionMode(lire(chemin), m[2])) || 'Script lancé automatiquement.',
        detail: [`Script : ${chemin}${m?.[2] ? ` (mode ${m[2]})` : ''}.`],
        tags: ['hook', evenement],
      });
    }
  }
}
gardiens.push({
  titre: 'Garde-fou de la synchro',
  court: "Bloque l'envoi sur GitHub si un mot interdit apparaît, car le dépôt est public.",
  detail: ['La liste des mots reste sur le Mac : sync/mots-interdits.txt, jamais synchronisée.', 'Claude montre le passage en cause à la conversation suivante.'],
  tags: ['sync/synchro.sh'],
});

// --- Page -----------------------------------------------------------------------------------
const BRANCHES = [
  { id: 'regles', titre: 'Mes règles', intro: 'Ce que Claude doit faire dans tous mes projets.', items: regles, cote: 'gauche' },
  { id: 'outils', titre: 'Outils', intro: 'Mes commandes et les plugins activés.', items: outils, cote: 'gauche' },
  { id: 'memoire', titre: 'Mémoire', intro: 'Ce que Claude a retenu, projet par projet.', items: memoire, cote: 'droite' },
  { id: 'gardiens', titre: 'Gardiens', intro: 'Ils travaillent tout seuls, au bon moment, sans qu’on le demande.', items: gardiens, cote: 'droite' },
];

const item = (it) => `
        <li><details>
          <summary><span class="nom">${echappe(it.titre)}</span><span class="court">${echappe(it.court)}</span></summary>
          <div class="plus">${it.detail.length ? `<ul class="detail">${it.detail.map((d) => `<li>${echappe(d)}</li>`).join('')}</ul>` : ''}<div class="tags">${it.tags.map((t) => `<span>${echappe(t)}</span>`).join('')}</div></div>
        </details></li>`;
const branche = (b) => `
    <section class="branche b-${b.id}" data-branche="${b.id}">
      <h2 class="bulle"><span>${echappe(b.titre)}</span><span class="nb">${b.items.length}</span></h2>
      <p class="intro">${echappe(b.intro)}</p>
      <ul>${b.items.map(item).join('')}
      </ul>
    </section>`;

const page = `<!doctype html>
<!-- Fichier généré par sync/carte.mjs à chaque synchro : ne pas le modifier à la main. -->
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Carte de claude-config</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800&family=Inter:wght@400;500;600&display=swap">
<style>
/* Carte mentale : claude-config au centre, deux branches de chaque côté, reliées par des courbes. */
:root {
  --bg: #F5F6FA; --carte: #FFFFFF; --texte: #1B2133; --doux: #5D6579; --trait: #DDE1EA;
  --regles: #E2683C; --outils: #1C9A6C; --memoire: #2F6BD8; --gardiens: #7B55C9;
  --titre: "Outfit", "Avenir Next", system-ui, sans-serif;
  --corps: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #11141C; --carte: #1A1F2B; --texte: #E8EBF2; --doux: #9AA2B4; --trait: #2B3242;
    --regles: #F2875F; --outils: #3CC492; --memoire: #6A97F0; --gardiens: #A585EC; color-scheme: dark; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--texte); font: 15px/1.5 var(--corps); padding: 28px max(16px, 3vw) 48px; }
header { max-width: 1280px; margin: 0 auto 8px; text-align: center; }
header p { margin: 4px 0 0; color: var(--doux); }
.carte { position: relative; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) 220px minmax(0, 1fr); gap: 28px; align-items: center; }
svg.liens { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
svg.liens path { fill: none; stroke-width: 4; stroke-linecap: round; opacity: .55; }
.colonne { display: flex; flex-direction: column; gap: 28px; min-width: 0; position: relative; z-index: 1; }
.centre { display: flex; justify-content: center; position: relative; z-index: 1; }
.coeur { width: 190px; height: 190px; border-radius: 50%; background: var(--texte); color: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 0 0 10px var(--carte), 0 0 0 11px var(--trait); }
.coeur strong { font: 800 26px/1.1 var(--titre); }
.coeur small { margin-top: 6px; font-size: 13px; opacity: .8; }
.branche { --c: var(--texte); background: var(--carte); border: 1px solid var(--trait); border-radius: 18px; padding: 16px 18px 14px; }
.b-regles { --c: var(--regles); } .b-outils { --c: var(--outils); } .b-memoire { --c: var(--memoire); } .b-gardiens { --c: var(--gardiens); }
.bulle { margin: 0; display: inline-flex; align-items: center; gap: 10px; background: var(--c); color: #fff; font: 700 20px/1 var(--titre); padding: 9px 16px; border-radius: 999px; }
.bulle .nb { background: rgba(255,255,255,.25); border-radius: 999px; font-size: 13px; padding: 3px 8px; }
.intro { margin: 8px 0 10px; color: var(--doux); font-size: 14px; }
ul { list-style: none; margin: 0; padding: 0 0 0 14px; border-left: 3px solid color-mix(in srgb, var(--c) 45%, transparent); display: flex; flex-direction: column; gap: 4px; }
li { position: relative; }
li::before { content: ""; position: absolute; left: -14px; top: 19px; width: 11px; height: 3px; background: color-mix(in srgb, var(--c) 45%, transparent); }
summary { list-style: none; cursor: pointer; display: flex; flex-direction: column; padding: 7px 34px 7px 10px; border-radius: 10px; position: relative; }
summary::-webkit-details-marker { display: none; }
summary::after { content: "+"; position: absolute; right: 10px; top: 6px; font: 700 18px/1 var(--titre); color: var(--c); transition: transform .2s; }
details[open] summary::after { transform: rotate(45deg); }
summary:hover, summary:focus-visible { background: color-mix(in srgb, var(--c) 10%, transparent); outline: none; }
summary:focus-visible { box-shadow: 0 0 0 2px var(--c); }
.nom { font: 700 16px/1.3 var(--titre); }
.court { color: var(--doux); font-size: 14px; }
.plus { padding: 2px 10px 10px; display: flex; flex-direction: column; gap: 8px; }
.plus p { margin: 0; font-size: 14px; }
ul.detail { border: 0; padding: 0 0 0 18px; list-style: disc; gap: 2px; font-size: 14px; }
ul.detail li::before { display: none; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tags span { font-size: 12px; border: 1px solid var(--trait); border-radius: 999px; padding: 1px 9px; color: var(--doux); }
footer { max-width: 1280px; margin: 28px auto 0; text-align: center; color: var(--doux); font-size: 13px; }
@media (max-width: 860px) {
  .carte { grid-template-columns: minmax(0, 1fr); }
  .centre { order: -1; }
  .coeur { width: 140px; height: 140px; }
  .coeur strong { font-size: 26px; }
  svg.liens { display: none; }
}
@media (prefers-reduced-motion: reduce) { summary::after { transition: none; } }
</style>
</head>
<body>
<header>
  <p>Clique sur un élément pour lire ce qu'il fait.</p>
</header>
<main class="carte" id="carte">
  <svg class="liens" id="liens" aria-hidden="true"></svg>
  <div class="colonne">${BRANCHES.filter((b) => b.cote === 'gauche').map(branche).join('')}
  </div>
  <div class="centre"><div class="coeur" id="coeur"><strong>claude-config</strong><small>ma config Claude Code</small></div></div>
  <div class="colonne">${BRANCHES.filter((b) => b.cote === 'droite').map(branche).join('')}
  </div>
</main>
<footer>Carte refaite automatiquement à chaque synchro, à partir des fichiers du dépôt. Les fichiers privés n'y figurent pas.</footer>
<script>
(function () {
  var carte = document.getElementById('carte'), svg = document.getElementById('liens'), coeur = document.getElementById('coeur');
  function dessiner() {
    var base = carte.getBoundingClientRect(), c = coeur.getBoundingClientRect();
    var cx = c.left + c.width / 2 - base.left, cy = c.top + c.height / 2 - base.top;
    var traits = '';
    document.querySelectorAll('.branche').forEach(function (b) {
      var bulle = b.querySelector('.bulle').getBoundingClientRect();
      var gauche = bulle.left + bulle.width / 2 < cx + base.left;
      var x = (gauche ? b.getBoundingClientRect().right : b.getBoundingClientRect().left) - base.left;
      var y = bulle.top + bulle.height / 2 - base.top;
      var mx = (cx + x) / 2;
      var couleur = getComputedStyle(b).getPropertyValue('--c');
      traits += '<path d="M' + cx + ' ' + cy + ' C' + mx + ' ' + cy + ' ' + mx + ' ' + y + ' ' + x + ' ' + y + '" stroke="' + couleur + '"/>';
    });
    svg.innerHTML = traits;
  }
  dessiner();
  if (window.ResizeObserver) new ResizeObserver(dessiner).observe(carte);
  window.addEventListener('resize', dessiner);
})();
</script>
</body>
</html>
`;

writeFileSync('carte.html', page);
